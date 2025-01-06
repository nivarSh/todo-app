import React, { useState, useEffect } from "react";

export function Timer({ tallyTime, updateTallyTime, currentDay }) {
  const [seconds, setSeconds] = useState(5400); // Initial time of timer is 90 minutes
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState(""); // For user input
  const [endTime, setEndTime] = useState(null); // Target end time in timestamp
  const [logButton, setLogButton] = useState(true);

  // Additional flag for button logic
  const [run, setRun] = useState(false);

  const toggle = () => {
    setLogButton(!logButton);
    setRun(true);

    if (!isActive) {
      setEndTime(Date.now() + seconds * 1000); // Set the end time
    } else {
      const remainingTime = Math.max(endTime - Date.now(), 0);
      setSeconds(Math.floor(remainingTime / 1000)); // Pause the timer
      setEndTime(null); // Clear the end time
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(5400);
    setIsActive(false);
    setEndTime(null);
    setRun(false);
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

  const playSound = () => {
    const audio = new Audio("/ringtone.mp3");
    audio.play();
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleInputChange = (e) => {
    setInputTime(e.target.value);
  };

  const setTimer = () => {
    setRun(false)
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

  const logSession = () => {
    if (!currentDay) {
      alert("Error: Unable to determine the current day.");
      return;
    }

    // Add the session's seconds to the current day's tally
    const newTallyTime = {
      ...tallyTime,
      [currentDay]: tallyTime[currentDay] + seconds,
    };
    console.log(tallyTime[currentDay] + seconds);
    updateTallyTime(newTallyTime);
    reset();
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
        {logButton && run && (
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
    </div>
  );
}
