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

      // Generate daily contributions for the current year
      const contributions: Record<string, number> = {};
      for (let d = new Date(startOfYear); d <= endOfYear; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD format
        const totalMinutes = dateMinutes[dateStr] || 0;

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

        contributions[dateStr] = level;
      }

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

  // Get weekday names and month names
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
  
  // Get color for contribution level with dark blue theme colors
  const getLevelColor = (level: number): string => {
    switch (level) {
      case 0: return 'rgba(255, 255, 255, 0.05)';    // Very light
      case 1: return 'rgba(97, 218, 251, 0.25)';     // Light blue
      case 2: return 'rgba(97, 218, 251, 0.5)';      // Medium blue
      case 3: return 'rgba(97, 218, 251, 0.75)';     // Dark blue
      case 4: return 'rgba(97, 218, 251, 1)';        // Full blue
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

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

  return (
    <div className="weekly-graph-box" style={{
      background: 'linear-gradient(145deg, #2c3e50, #1a2533)',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
      width: '100%',
      padding: '25px',
      height: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h5 style={{ color: 'white', margin: 0, fontWeight: 600, fontSize: '18px' }}>
          {loading ? 'Loading...' : `${calculateTotalContributions()} reading days in ${currentYear}`}
        </h5>
      </div>
      
      <div style={{ display: 'flex', marginBottom: '8px', paddingLeft: '20px' }}>
        {monthLabels.map((label, i) => (
          <div 
            key={i} 
            style={{ 
              marginLeft: i === 0 ? `${label.position * 14}px` : '0',
              fontSize: '12px',
              color: '#e0e0e0',
              opacity: 0.7,
              flexGrow: 1
            }}
          >
            {months[label.month]}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex' }}>
        {/* Weekday labels */}
        <div style={{ 
          marginRight: '10px',
          display: 'grid', 
          gridTemplateRows: 'repeat(7, 12px)', 
          gap: '2px',
          alignItems: 'center'
        }}>
          {weekdays.map((day, i) => (
            <div key={i} style={{ fontSize: '10px', lineHeight: '12px', color: '#e0e0e0', opacity: 0.7 }}>
              {day}
            </div>
          ))}
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex' }}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} style={{ 
                display: 'grid',
                gridTemplateRows: 'repeat(7, 12px)',
                gridAutoFlow: 'column',
                gap: '2px'
              }}>
                {week.map((day, dayIndex) => (
                  <div 
                    key={dayIndex}
                    style={{ 
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      backgroundColor: day ? getLevelColor(day.level) : 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease'
                    }}
                    title={day ? day.tooltip : ''}
                    onClick={() => handleDayClick(day)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '15px', 
        display: 'flex', 
        alignItems: 'center',
        fontSize: '12px',
        color: '#e0e0e0',
        opacity: 0.7
      }}>
        <span style={{ marginRight: '5px' }}>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div 
            key={level}
            style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '2px',
              backgroundColor: getLevelColor(level),
              marginLeft: level > 0 ? '5px' : '0',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
        ))}
        <span style={{ marginLeft: '5px' }}>More</span>
      </div>
      
      {selectedDay && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h6 style={{ marginBottom: '8px', color: 'white', fontWeight: 500 }}>
            {new Date(selectedDay.date).toDateString()}
          </h6>
          <p style={{ 
            marginBottom: '0', 
            fontSize: '14px', 
            color: '#e0e0e0',
            opacity: 0.8
          }}>
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
  );
};

export default YearlyProgress;