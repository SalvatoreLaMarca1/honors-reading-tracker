import React, { useState } from 'react';
// Note: This assumes you have Bootstrap CSS included in your project
// Either via import 'bootstrap/dist/css/bootstrap.min.css'; or a CDN link

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
  // Generate sample contribution data
  const generateContributionData = (): Record<string, number> => {
    const data: Record<string, number> = {};
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - 1); // Start one year ago from yesterday
    
    // Create contribution data for each day in the last year
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Randomly assign contribution levels, weighted toward 0
      const rand = Math.random();
      let level: number;
      if (rand < 0.55) level = 0;      // No contributions: 55%
      else if (rand < 0.75) level = 1; // Light: 20%
      else if (rand < 0.90) level = 2; // Medium-light: 15%
      else if (rand < 0.97) level = 3; // Medium: 7%
      else level = 4;                  // Dark: 3%
      
      data[dateStr] = level;
    }
    return data;
  };

  const [contributionData, setContributionData] = useState<Record<string, number>>(generateContributionData());
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  
  // Get weekday names and month names
  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate the cells for the calendar
  const renderCalendar = (): { weeks: Array<Array<ContributionDay | null>>; monthLabels: MonthLabel[] } => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - 1);
    
    // Initialize with the right offset for the weekday
    const firstSunday = new Date(oneYearAgo);
    const dayOfWeek = firstSunday.getDay();
    firstSunday.setDate(firstSunday.getDate() - dayOfWeek);
    
    const weeks: Array<Array<ContributionDay | null>> = [];
    let currentWeek: Array<ContributionDay | null> = [];
    const totalDays = 53 * 7; // 53 weeks for good measure
    
    // Track month labels
    const monthLabels: MonthLabel[] = [];
    let lastMonth = -1;
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(firstSunday);
      currentDate.setDate(firstSunday.getDate() + i);
      
      // Check if we should add a month label
      const month = currentDate.getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        monthLabels.push({
          month,
          position: Math.floor(i / 7) // Column position
        });
      }
      
      // Create the day cell
      const dateStr = currentDate.toISOString().split('T')[0];
      const level = contributionData[dateStr] || 0;
      
      // Only add days within our date range
      if (currentDate >= oneYearAgo && currentDate <= today) {
        currentWeek.push({
          date: dateStr,
          level,
          tooltip: `${level} contributions on ${currentDate.toDateString()}`
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

  // Function to regenerate data (for demo purposes)
  const regenerateData = () => {
    setContributionData(generateContributionData());
    setSelectedDay(null);
  };

  // Function to handle square click
  const handleDayClick = (day: ContributionDay | null) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  // Calculate total contributions
  const calculateTotalContributions = (): number => {
    return Object.values(contributionData).reduce((sum, level) => sum + level, 0);
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
    cursor: 'pointer'
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">{calculateTotalContributions()} contributions in the last year</h5>
          <button 
            onClick={regenerateData} 
            className="btn btn-sm btn-outline-secondary"
          >
            Regenerate Data
          </button>
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
          <div className="me-2 small text-muted" style={{ display: 'grid', gridTemplateRows: 'repeat(7, 12px)', gap: '2px' }}>
            {weekdays.filter((_, i) => i % 2 === 0).map((day, i) => (
              <div key={i} className="d-flex align-items-center">
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
                "No contributions on this day" : 
                `${selectedDay.level} contribution${selectedDay.level > 1 ? 's' : ''} on this day`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlyProgress;