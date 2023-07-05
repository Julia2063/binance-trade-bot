import { useState, useEffect } from 'react';
import './Timer.scss';


export const Timer =  ({ date }) => {
    const [finishTime] = useState(date.getTime());
    const [[diffMonth, diffDays, diffH, diffM, diffS], setDiff] = useState([0, 0, 0, 0, 0]);
    const [tick, setTick] = useState(false);
    const [isTimeout, setIsTimeout] = useState(false);
    const [timerId, setTimerID] = useState(0);
  
    useEffect(() => {
      const diff = (finishTime - new Date()) / 1000;
      if (diff < 0) {
        setIsTimeout(true);
        return;
      }
      setDiff([
        Math.floor(diff /  2629800),
        Math.floor((diff / 86400) % 30.43), // дни
        Math.floor((diff / 3600) % 24),
        Math.floor((diff / 60) % 60),
        Math.floor(diff % 60)
      ]);
    }, [tick, finishTime]);
  
    useEffect(() => {
      if (isTimeout) clearInterval(timerId);
    }, [isTimeout, timerId]);
  
    useEffect(() => {
      const timerID = setInterval(() => {
        setTick(!tick);
      }, 1000);
      setTimerID(timerID);
      return () => clearInterval(timerID);
    }, [tick]);
  
    return (
        <div className='timer'> 
            <div className='timer__item'>
                {diffMonth}
                <p>months</p>
            </div>
            <span>:</span>
            <div className='timer__item'>
                {diffDays}
                <p>days</p>
            </div>
            <span>:</span>
            <div className='timer__item'>
                {diffH.toString().padStart(2, "0")}
                <p>hours</p>
            </div>
            <span>:</span>
            <div className='timer__item'>
                {diffM.toString().padStart(2, "0")}
                <p>minutes</p>
            </div>
            <span>:</span>
            <div className='timer__item'>
                {diffS.toString().padStart(2, "0")}
                <p>seconds</p>
            </div>
        </div>
      
    );
  };