import { useEffect, useState } from "react";

import "../App.css"
import { useNavigate } from "react-router-dom";


function Read() {

    const navigate = useNavigate()

    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
  
    useEffect(() => {
      let intervalId = null;
      
      if (isRunning) {
        intervalId = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);
      }
      
      // Cleanup function to clear interval when component unmounts or when isRunning changes
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [isRunning]); // Only re-run effect when isRunning changes
  
    const toggleTimer = () => {
      setIsRunning(!isRunning);
    };
  
    // Format seconds into HH:MM:SS
    const formatTime = (totalSeconds: number) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
    };
  
    return (
      <div>
        <h1>
          {formatTime(seconds)}
        </h1>
        <div className="read-button-cluster">
            <button onClick={() => navigate('/honors-reading-tracker/dashboard')}className="btn btn-primary btn-sm">Finish Reading</button>
            
            <button className="btn btn-primary btn-sm" onClick={toggleTimer}>
            {isRunning ? 'Pause' : 'Resume'}
            </button>
            
        </div>
      </div>
    );
  };
  
  export default Read