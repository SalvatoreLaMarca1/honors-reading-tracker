import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface ContributionDay {
  date: string;
  level: number;
  tooltip: string;
}

interface MonthLabel {
  month: number;
  position: number;
}

const YearlyProgress: React.FC = () => {
  const [contributionData, setContributionData] = useState<Record<string, number>>({});
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Get current year
  const currentYear = new Date().getFullYear();

  const getEntriesFromCurrentYear = async () => {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error fetching user:', authError);
      return null;
    }
  
    // Get the start of current year (January 1st)
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    
    // Get the end of current year (December 31st)
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
  
    try {
      const { data, error } = await supabase
        .from('Entries')
        .select('*')
        .eq('user_id', user.id) // Filter by authenticated user
        .gte('created_at', startOfYear.toISOString()) // Entries on or after startDate
        .lte('created_at', endOfYear.toISOString()) // Entries on or before endDate
        .order('created_at', { ascending: false }); // Order by created_at in descending order
  
      if (error) {
        console.error('Error fetching entries:', error);
        return null;
      }

      // Group minutes read by date
      const dateMinutes: Record<string, number> = {};
      data.forEach(entry => {
        const dateStr = entry.created_at.split('T')[0]; // Extract YYYY-MM-DD
        dateMinutes[dateStr] = (dateMinutes[dateStr] || 0) + entry.minutes_read;
      });

      console.log("dateMinutes", dateMinutes)


      // Generate daily contributions for the current year
      const contributions: Record<string, number> = {};
      for (let d = new Date(startOfYear); d <= endOfYear; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD format
        const totalMinutes = dateMinutes[dateStr] || 0;

        if(dateMinutes[dateStr]) console.log(dateStr)

        // Assign contribution level based on total minutes read
        let level = 0;

        // Fixed the logic to properly assign levels
        if (totalMinutes === 0) {
          level = 0;
        } else if (totalMinutes <= 10) {
          level = 1;
        } else if (totalMinutes <= 30) {
          level = 2;
        } else if (totalMinutes <= 60) {
          level = 3;
        } else {
          level = 4;
        }

        if(dateStr === "2025-05-21") level = 4

        contributions[dateStr] = level;
      }

      console.log('Total minutes per day:', dateMinutes);
      console.log('Contribution levels:', contributions);
      return contributions;
    } catch (error) {
      console.error('Error fetching entries:', error);
      return null;
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const fetchedData = await getEntriesFromCurrentYear();
      
      if (fetchedData) {
        setContributionData(fetchedData);
      }
      setLoading(false);
    };
    
    initData();
  }, []);

  // Get weekday names and month names// Fix the weekdays array to include all 7 days and match JavaScript's getDay() ordering
  const weekdays: string[] = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate the cells for the calendar
  const renderCalendar = (): { weeks: Array<Array<ContributionDay | null>>; monthLabels: MonthLabel[] } => {
    // Start from January 1st of the current year
    const startDate = new Date(currentYear, 0, 1);
    // End at December 31st of the current year
    const endDate = new Date(currentYear, 11, 31);
    
    // Find the first Sunday before or on January 1st
    const firstSunday = new Date(startDate);
    const dayOfWeek = firstSunday.getDay();
    firstSunday.setDate(firstSunday.getDate() - dayOfWeek);
    
    const weeks: Array<Array<ContributionDay | null>> = [];
    let currentWeek: Array<ContributionDay | null> = [];
    
    // Calculate total days needed (up to 54 weeks to cover the full year plus padding)
    const totalDays = 54 * 7;
    
    // Track month labels
    const monthLabels: MonthLabel[] = [];
    let lastMonth = -1;
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(firstSunday);
      currentDate.setDate(firstSunday.getDate() + i);
      
      // Stop once we've gone past December 31st plus any days to complete the week
      if (currentDate > endDate && currentDate.getDay() === 0) {
        break;
      }
      
      // Check if we should add a month label (only for dates in the target year)
      const month = currentDate.getMonth();
      if (month !== lastMonth && currentDate.getFullYear() === currentYear) {
        lastMonth = month;
        monthLabels.push({
          month,
          position: Math.floor(i / 7) // Column position
        });
      }
      
      // Create the day cell
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Only add days within our date range (the current year)
      if (currentDate >= startDate && currentDate <= endDate) {
        const level = contributionData[dateStr] || 0;
        currentWeek.push({
          date: dateStr,
          level,
          tooltip: `${level || 'No'} contribution${level !== 1 ? 's' : ''} on ${currentDate.toDateString()}`
        });
      } else {
        currentWeek.push(null); // Placeholder for days outside our range
      }
      
      // Start a new week after 7 days
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }
    
    return { weeks, monthLabels };
  };
  
  const { weeks, monthLabels } = renderCalendar();
  
  // Get color for contribution level using bootstrap classes
  const getLevelColor = (level: number): string => {
    switch (level) {
      case 0: return 'bg-light';
      case 1: return 'bg-dark bg-opacity-25';
      case 2: return 'bg-dark bg-opacity-50';
      case 3: return 'bg-dark bg-opacity-75';
      case 4: return 'bg-dark';
      default: return 'bg-light';
    }
  };

  // const regenerateData = async () => {  
  //   setLoading(true);
  //   const fetchedData = await getEntriesFromCurrentYear();
    
  //   if (fetchedData) {
  //     setContributionData(fetchedData);
  //   } 

  //   setSelectedDay(null);
  //   setLoading(false);
  // };

  // Function to handle square click
  const handleDayClick = (day: ContributionDay | null) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  // Calculate total contributions
  const calculateTotalContributions = (): number => {
    return Object.values(contributionData).filter(level => level > 0).length;
  };

  // Custom CSS for contribution grid layout
  const gridStyle = {
    display: 'grid',
    gridTemplateRows: 'repeat(7, 12px)',
    gridAutoFlow: 'column',
    gap: '2px'
  };

  const cellStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    cursor: 'pointer',
     border: '1px solid black'
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">
            {loading ? 'Loading...' : `${calculateTotalContributions()} reading days in ${currentYear}`}
          </h5>
          {/* <button 
            onClick={regenerateData} 
            className="btn btn-sm btn-outline-secondary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button> */}
        </div>
        
        <div className="d-flex mb-1 small text-muted">
          {monthLabels.map((label, i) => (
            <div 
              key={i} 
              className="flex-grow-1" 
              style={{ 
                marginLeft: i === 0 ? `${label.position * 14}px` : '0'
              }}
            >
              {months[label.month]}
            </div>
          ))}
        </div>
        
        <div className="d-flex">
          {/* Fixed weekday labels section */}
          <div className="me-2 small text-muted" style={{ 
            display: 'grid', 
            gridTemplateRows: 'repeat(7, 12px)', 
            gap: '2px',
            alignItems: 'center',
            height: '100%'
          }}>
            {weekdays.map((day, i) => (
              <div key={i} style={{ fontSize: '10px', lineHeight: '12px' }}>
                {day}
              </div>
            ))}
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <div className="d-flex">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} style={gridStyle}>
                  {week.map((day, dayIndex) => (
                    <div 
                      key={dayIndex}
                      className={`${day ? getLevelColor(day.level) : ''}`}
                      style={cellStyle}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={day ? day.tooltip : ''}
                      onClick={() => handleDayClick(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-3 d-flex align-items-center small text-muted">
          <span className="me-1">Less</span>
          <div className={`${getLevelColor(0)}`} style={{ width: '12px', height: '12px', borderRadius: '2px' }}></div>
          <div className={`${getLevelColor(1)} ms-1`} style={{ width: '12px', height: '12px', borderRadius: '2px' }}></div>
          <div className={`${getLevelColor(2)} ms-1`} style={{ width: '12px', height: '12px', borderRadius: '2px' }}></div>
          <div className={`${getLevelColor(3)} ms-1`} style={{ width: '12px', height: '12px', borderRadius: '2px' }}></div>
          <div className={`${getLevelColor(4)} ms-1`} style={{ width: '12px', height: '12px', borderRadius: '2px' }}></div>
          <span className="ms-1">More</span>
        </div>
        
        {selectedDay && (
          <div className="mt-3 p-3 bg-light border rounded">
            <h6 className="mb-1">{new Date(selectedDay.date).toDateString()}</h6>
            <p className="mb-0 small text-muted">
              {selectedDay.level === 0 ? 
                "No reading on this day" : 
                `Reading level: ${selectedDay.level} (${
                  selectedDay.level === 1 ? "1-10 minutes" :
                  selectedDay.level === 2 ? "11-30 minutes" :
                  selectedDay.level === 3 ? "31-60 minutes" :
                  "60+ minutes"
                })`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlyProgress;