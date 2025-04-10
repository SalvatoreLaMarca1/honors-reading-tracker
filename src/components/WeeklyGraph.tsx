import { useEffect, useState } from 'react';
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
  const [pagesByDay, setPageByDay] = useState<{ [key: string]: number}>({});
  const [chartData, setChartData] = useState<{ day: string; minutes: number; pages: number }[]>([]);
  const [chartKey, setChartKey] = useState(0);

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
          pagesMap[daysOfWeek] = 0;
        }

        minutesMap[daysOfWeek] += entry.minutes_read;
        pagesMap[daysOfWeek] += entry.pages_read;
      });

      setMinutesByDay(minutesMap);
      setPageByDay(pagesMap);
    }
  }, [weekData]);

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

  const getWeekStatusText = () => {
    if (weekOffset === 0) return 'Current Week';
    if (weekOffset < 0) return `${Math.abs(weekOffset)} ${Math.abs(weekOffset) === 1 ? 'Week' : 'Weeks'} Ago`;
    return `${weekOffset} ${weekOffset === 1 ? 'Week' : 'Weeks'} Ahead`;
  };

  const totalReadingTime = chartData.reduce((sum, item) => sum + item.minutes, 0);
  const totalPagesRead = chartData.reduce((sum, item) => sum + item.pages, 0);

  // Custom styling for the chart
  const customTooltipStyle = {
    backgroundColor: 'rgba(26, 37, 51, 0.9)',
    border: '1px solid #61dafb',
    borderRadius: '8px',
    padding: '10px',
    color: '#ecf0f1',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div style={customTooltipStyle}>
          <p className="fw-bold mb-2">{label}</p>
          <p style={{ color: '#61dafb' }}>{`Minutes: ${payload[0].value}`}</p>
          <p style={{ color: '#ff7300' }}>{`Pages: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      background: 'linear-gradient(145deg, #2c3e50, #1a2533)', 
      borderRadius: '20px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
      width: '100%',
      overflow: 'hidden',
      color: '#ecf0f1'
    }}>
      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(45deg, #304457, #2c3e50)',
        borderBottom: '1px solid rgba(97, 218, 251, 0.3)'
      }}>
        <div className="text-center">
          <h5 style={{ margin: 0, color: 'white', fontWeight: 600 }}>Weekly Reading Activity</h5>
          <div style={{ fontSize: '1rem', fontWeight: 500, marginTop: '5px', color: '#ecf0f1' }}>{getWeekLabel(weekOffset)}</div>
        </div>
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px'
        }}>
          <button 
            style={{
              background: 'transparent',
              color: '#61dafb',
              border: '1px solid #61dafb',
              borderRadius: '20px',
              padding: '8px 15px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 500
            }}
            onClick={goToPreviousWeek}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(97, 218, 251, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Previous</span>
          </button>
          
          <div style={{
            background: 'rgba(97, 218, 251, 0.2)',
            borderRadius: '15px',
            padding: '5px 12px',
            color: '#ecf0f1',
            fontWeight: 500
          }}>
            {getWeekStatusText()}
          </div>
          
          <button 
            style={{
              background: 'transparent',
              color: weekOffset >= 0 ? '#566573' : '#61dafb',
              border: `1px solid ${weekOffset >= 0 ? '#566573' : '#61dafb'}`,
              borderRadius: '20px',
              padding: '8px 15px',
              display: 'flex',
              alignItems: 'center',
              cursor: weekOffset >= 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 500
            }}
            onClick={goToNextWeek}
            disabled={weekOffset >= 0}
            onMouseOver={(e) => {
              if (weekOffset < 0) {
                e.currentTarget.style.background = 'rgba(97, 218, 251, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (weekOffset < 0) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span>Next</span>
          </button>
        </div>
        
        <div style={{ height: "300px", marginBottom: '20px' }}>
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
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(236, 240, 241, 0.1)" 
              />
              <XAxis 
                dataKey="day" 
                stroke="#ecf0f1" 
                tick={{ fill: '#ecf0f1' }} 
              />
              <YAxis 
                domain={[0, (dataMax: number) => dataMax * 1.2]} 
                stroke="#ecf0f1" 
                tick={{ fill: '#ecf0f1' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#ecf0f1', paddingTop: '10px' }} 
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#61dafb"
                strokeWidth={2}
                dot={{ r: 5, fill: '#61dafb', strokeWidth: 0 }}
                activeDot={{ r: 8, fill: '#61dafb', stroke: '#fff' }}
                isAnimationActive={true}
                name="Minutes Read"
              />
              <Line
                type="monotone"
                dataKey="pages"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ r: 5, fill: '#ff7300', strokeWidth: 0 }}
                activeDot={{ r: 8, fill: '#ff7300', stroke: '#fff' }}
                isAnimationActive={true}
                name="Pages Read"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ 
          padding: '15px 20px', 
          borderRadius: '15px', 
          background: 'rgba(44, 62, 80, 0.7)',
          border: '1px solid rgba(97, 218, 251, 0.2)',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ color: '#ecf0f1', fontWeight: 500 }}>Weekly Summary</span>
            <span style={{ color: '#61dafb', fontWeight: 600 }}>{totalReadingTime} minutes</span>
          </div>
          <div style={{ 
            height: '8px', 
            background: 'rgba(236, 240, 241, 0.1)', 
            borderRadius: '4px', 
            marginBottom: '8px', 
            overflow: 'hidden' 
          }}>
            <div 
              style={{ 
                width: `${Math.min(100, (totalReadingTime / 420) * 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #61dafb, #3498db)',
                borderRadius: '4px',
                transition: 'width 1s ease-in-out'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#aaa' }}>Goal: 420 min</span>
            <span style={{ color: '#aaa' }}>{totalPagesRead} pages read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyGraph;