import React, { useState, useEffect } from "react";

export function Timer() {
  const [seconds, setSeconds] = useState(5400); // Initial time of timer is 90 minutes
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState(""); // For user input
  const [endTime, setEndTime] = useState(null); // Target end time in timestamp
  const [logButton, setLogButton] = useState(false);
  const [tallyTime, setTallyTime] = useState(0); // New state to store total logged time

  // Function to reset the tallyTime weekly on Monday
  const resetWeeklyTally = () => {
    const lastResetDate = localStorage.getItem("last-reset-date");
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Get the current day (0 = Sunday, 1 = Monday, etc.)

    // If today is Monday and the tally hasn't been reset yet this week, reset it
    if (lastResetDate) {
      const lastReset = new Date(lastResetDate);
      const lastResetDay = lastReset.getDay();
      const diffInDays = (currentDate - lastReset) / (1000 * 60 * 60 * 24);

      // If it's a new week (Monday) and tally hasn't been reset, reset the tallyTime
      if (currentDay === 1 && (lastResetDay !== 1 || diffInDays >= 7)) {
        setTallyTime(0); // Reset tallyTime
        localStorage.setItem("user-tally-time", 0); // Store reset tallyTime in localStorage
        localStorage.setItem("last-reset-date", currentDate.toISOString()); // Update the last reset date
      }
    } else {
      // If there's no last reset date, it's the first time, so set it
      localStorage.setItem("last-reset-date", currentDate.toISOString());
    }
  };

  // toggle the timer on/off
  const toggle = () => {
    setLogButton(!logButton);

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

  // Update tallyTime in localStorage when it changes
  const updateTallyTime = (newTallyTime) => {
    setTallyTime(newTallyTime);
    localStorage.setItem("user-tally-time", newTallyTime); // Store tally time in localStorage
  };

  useEffect(() => {
    const storedTallyTime = localStorage.getItem("user-tally-time");
    if (storedTallyTime) {
      setTallyTime(Number(storedTallyTime)); // Load tally time from localStorage
    }
    resetWeeklyTally(); // Check and reset tallyTime weekly
  }, []);

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

  // Convert seconds to hours and minutes
  const formatTimeInHoursAndMinutes = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hours and ${minutes} minutes`;
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

  // Log the session and add the session time to the tally
  const logSession = () => {
    const newTallyTime = tallyTime + seconds; // Add the current session time to the tally
    updateTallyTime(newTallyTime); // Update tallyTime and store in localStorage
    reset(); // Reset the timer after logging the session
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
        {logButton && (
          <button className="baby-spacing fade" onClick={logSession}>
            Log Session
          </button>
        )}
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
      <div className="baby-spacing">
        <h1 className="text-gradient">Deepwork Tally</h1>
        {/* Display the total logged time in hours and minutes */}
        <h3 className="baby-spacing">
          You have logged {formatTimeInHoursAndMinutes(tallyTime)} this week.
        </h3>
      </div>
    </div>
  );
}
