import React, { useState, useEffect } from "react";

export function Timer() {
  const [seconds, setSeconds] = useState(5400); // Initial time of timer is 60 seconds
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState(""); // For user input

  // toggle the timer on/off
  const toggle = () => {
    setIsActive(!isActive); // do the opposite
  };

  // reset the timer
  const reset = () => {
    setSeconds(5400);
    setIsActive(false);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      // setInterval, built in js function that executes a function repeatedly every 1000 ms, returns the interval id
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1); // using (seconds) is notation for using the previous state
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      // paused timer condition
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]); // tells useEffect to run whenever isActive or seconds change

  // Helper function to format time as MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60); // Get the whole minutes
    const seconds = totalSeconds % 60; // Get the remaining seconds
    const formattedMinutes = String(minutes).padStart(2, "0"); // Pad with zero if needed
    const formattedSeconds = String(seconds).padStart(2, "0"); // Pad with zero if needed
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Handle input change for user-set time
  const handleInputChange = (e) => {
    setInputTime(e.target.value); // Update input state
  };

  const setTimer = () => {
    const [minutes, seconds] = inputTime.split(":").map(Number);
    if (!isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0) {
      setSeconds(minutes * 60 + seconds);
      setInputTime("");
      setIsActive(false);
    } else {
      alert("Please Enter a valid time in MM:SS format");
    }
  };

  return (
    <div>
      <h3>{formatTime(seconds)}</h3>
      <div className="timer-buttons">
        <button className="baby-spacing card-button-primary" onClick={toggle}>
          {isActive ? "Pause" : "Start"}
        </button>
        <button className="baby-spacing" onClick={reset}>Reset</button>
      </div>
      <div className="input-container baby-spacing">
        <input
          type="text"
          placeholder="MM:SS"
          value={inputTime}
          onChange={handleInputChange}
        />
        <button onClick={setTimer}>Set Timer</button>
      </div>
    </div>
  );
}
