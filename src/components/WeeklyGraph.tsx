import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabase';

interface Entry {
  entry_id: number;
  created_at: string;
  book_id: number;
  minutes_read: number;
  pages_read: number;
  user_id: string;
}

const WeeklyGraph = () => {
  // Track the current week offset (0 = current week, -1 = last week, etc.)
  const [weekOffset, setWeekOffset] = useState(0);

  const [weekData, setWeekData] = useState<Entry[]>([]);
  const [minutesByDay, setMinutesByDay] = useState<{ [key: string]: number }>({});
  const [pagesByDay, setPageByDay] = useState<{ [key: string]: number}>({})


  const [chartData, setChartData] = useState<{ day: string; minutes: number }[]>([]);

  // Get Week Data from db
  const getWeekData = async (startDate: string, endDate: string) => {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Error fetching user:", authError);
        return null;
    }

    const userId = user.id; // Get user ID from Supabase auth

    // Fetch entries for this user within the date range
    const { data, error } = await supabase
        .from('Entries')
        .select('*')
        .eq('user_id', userId) // Only get entries for this user
        .gte('created_at', startDate) // Entries on or after startDate
        .lte('created_at', endDate);  // Entries on or before endDate

    if (error) {
        console.error('Error fetching entries:', error);
        return null;
    }

    console.log("weekData", data);
    setWeekData(data); // Store the fetched data

    return data;
};

useEffect(() => {
  if (weekData.length >= 0) {
    const minutesMap: {[key: string]: number} = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    };

    const pagesMap: {[key: string]: number} = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    };

    weekData.forEach((entry: Entry) => {
      const daysOfWeek = new Date(entry.created_at).toLocaleString('en-US', {weekday: 'long'});

      if (!minutesMap[daysOfWeek]) {
        minutesMap[daysOfWeek] = 0;
      }

      if(!pagesMap[daysOfWeek]) {
        pagesMap[daysOfWeek] = 0
      }

      minutesMap[daysOfWeek] += entry.minutes_read;
      pagesMap[daysOfWeek] += entry.pages_read;
    });

    setMinutesByDay(minutesMap);
    setPageByDay(pagesMap)
  }
}, [weekData]);

const [chartKey, setChartKey] = useState(0);

useEffect(() => {
  if (Object.keys(minutesByDay).length > 0) {
    const updatedChartData = Object.keys(minutesByDay).map((day) => ({
      day,
      minutes: minutesByDay[day],
      pages: pagesByDay[day] || 0,
    }));
    
    setChartData(updatedChartData);

    // Force Recharts to recognize change by updating key
    setChartKey((prev) => prev + 1);
  }
}, [minutesByDay, pagesByDay]);

useEffect(() => {
  const { startDate, endDate } = getWeekDateRange(weekOffset);
  getWeekData(startDate, endDate);
}, [weekOffset]);

  const getWeekLabel = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Convert Sunday (0) to 7
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1 + (offset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const formatDate = (date: Date) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };
    
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  const goToPreviousWeek = () => {
    setWeekOffset(prevOffset => {
        const newOffset = prevOffset - 1;
        const { startDate, endDate } = getWeekDateRange(newOffset);
        getWeekData(startDate, endDate);
        return newOffset;
    });
  };
  
  const goToNextWeek = () => {
    if (weekOffset < 0) {
        setWeekOffset(prevOffset => {
            const newOffset = prevOffset + 1;
            const { startDate, endDate } = getWeekDateRange(newOffset);
            getWeekData(startDate, endDate);
            return newOffset;
        });
    }
  };

  const getWeekDateRange = (offset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Convert Sunday (0) to 7

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1 + (offset * 7));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString()
    };
  };

  // const totalReadingTime = chartData.reduce((sum, item) => sum + item.minutes, 0);

  const getWeekStatusText = () => {
    if (weekOffset === 0) return 'Current Week';
    if (weekOffset < 0) return `${Math.abs(weekOffset)} ${Math.abs(weekOffset) === 1 ? 'Week' : 'Weeks'} Ago`;
    return `${weekOffset} ${weekOffset === 1 ? 'Week' : 'Weeks'} Ahead`;
  };

  // const maxMinutes = Math.max(...chartData.map(item => item.minutes));
  // const yAxisDomain = [0, maxMinutes + 10];

  return (
    <div className="card w-100 shadow-sm">
      <div className="card-header bg-primary text-white">
        <div className="text-center">
          <h5 className="mb-0">Weekly Reading Activity</h5>
          <div className="fs-6 fw-bold mt-1">{getWeekLabel(weekOffset)}</div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button 
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={goToPreviousWeek}
            // disabled={weekOffset <= -5}
          >
            <span>Previous</span>
          </button>
          
          <div className="badge bg-secondary">{getWeekStatusText()}</div>
          
          <button 
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={goToNextWeek}
            disabled={weekOffset >= 0}
          >
            <span>Next</span>
          </button>
        </div>
        
        <div style={{ height: "300px" }}>
          
            <ResponsiveContainer width="100%" height="100%" key={chartKey}>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, (dataMax: number) => dataMax * 1.2]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#0d6efd"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="pages"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
        
        {/* <div className="card mt-3 bg-light">
          <div className="card-body p-2">
            
            <div className="progress mt-2" style={{ height: "10px" }}>
              <div 
                className="progress-bar bg-primary" 
                role="progressbar" 
                style={{ width: `${Math.min(100, (totalReadingTime / 420) * 100)}%` }} 
                aria-valuenow={totalReadingTime} 
                aria-valuemin={0} 
                aria-valuemax={420}
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <small className="text-muted">0 min</small>
              <small className="text-muted">Target: 420 min</small>
            </div>
          </div>
        </div> */}
    </div>
  );
};

export default WeeklyGraph;
