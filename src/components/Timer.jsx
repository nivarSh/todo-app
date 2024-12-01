import React, { useState, useEffect } from "react";

export function Timer() {
  const [seconds, setSeconds] = useState(5400); // Initial time of timer is 90 minutes
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState(""); // For user input
  const [endTime, setEndTime] = useState(null); // Target end time in timestamp

  // toggle the timer on/off
  const toggle = () => {
    if (!isActive) {
      setEndTime(Date.now() + seconds * 1000); // Set the end time
    } else {
      const remainingTime = Math.max(endTime - Date.now(), 0);
      setSeconds(Math.floor(remainingTime / 1000)); // Pause the timer
      setEndTime(null); // Clear the end time
    }
    setIsActive(!isActive);
  };

  // reset the timer
  const reset = () => {
    setSeconds(5400);
    setIsActive(false);
    setEndTime(null);
  };

  useEffect(() => {
    if (!isActive || seconds === 0) return;

    const interval = setInterval(() => {
      const remainingTime = Math.max(endTime - Date.now(), 0);
      setSeconds(Math.floor(remainingTime / 1000));

      if (remainingTime === 0) {
        clearInterval(interval);
        setIsActive(false);
        playSound();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, endTime]);

  // Function to play sound
  const playSound = () => {
    const audio = new Audio("/ringtone.mp3");
    audio.play();
  };

  // Helper function to format time as MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Handle input change for user-set time
  const handleInputChange = (e) => {
    setInputTime(e.target.value);
  };

  const setTimer = () => {
    const [minutes, seconds] = inputTime.split(":").map(Number);
    if (!isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0) {
      setSeconds(minutes * 60 + seconds);
      setInputTime("");
      setIsActive(false);
      setEndTime(null);
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
        <button className="baby-spacing" onClick={reset}>
          Reset
        </button>
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
