
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyGraph = () => {
    // Data for daily reading minutes
    const data = [
      { day: 'Monday', minutes: 45 },
      { day: 'Tuesday', minutes: 60 },
      { day: 'Wednesday', minutes: 35 },
      { day: 'Thursday', minutes: 50 },
      { day: 'Friday', minutes: 40 },
      { day: 'Saturday', minutes: 75 },
      { day: 'Sunday', minutes: 65 }
    ];
  
    // Note: Bootstrap is being used via className attributes instead of Tailwind
    return (
      <div className="card w-100 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Daily Reading Minutes</h5>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#0d6efd" 
                  strokeWidth={2}
                  dot={{ r: 5 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-muted small mt-3">
            Total reading time: {data.reduce((sum, item) => sum + item.minutes, 0)} minutes
          </div>
        </div>
      </div>
    );
  };

export default WeeklyGraph;