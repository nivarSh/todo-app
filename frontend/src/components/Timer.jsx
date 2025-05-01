import React, { useState, useEffect, useRef } from "react";
import axios from "axios"

export function Timer({ currentDay, triggerTallyRefresh }) {
axios.defaults.withCredentials = true; // tell axios to send cookies with every request
  const defaultTime = 5400; // Default seconds everytime page is loaded or reset is pressed

  const [seconds, setSeconds] = useState(defaultTime); // Initial time of timer is 90 minutes
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState(""); // For user input
  const [endTime, setEndTime] = useState(null); // Target end time in timestamp
  const [logButton, setLogButton] = useState(true);
  const [setTime, setSetTime] = useState(defaultTime);
  const [logPopup, setLogPopup] = useState(false);

  const [run, setRun] = useState(false);

  const audioRef = useRef(new Audio("/ringtone1.mp3"));

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
    setSeconds(defaultTime);
    setSetTime(defaultTime);
    setIsActive(false);
    setEndTime(null);
    setLogButton(true);
    setRun(false);
    setLogPopup(false);
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
        setLogPopup(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, endTime]);

  const playSound = () => {
    const audio = audioRef.current;
    audio.play();
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleInputChange = (e) => {
    setInputTime(e.target.value);
  };

  const setTimer = () => {
    setRun(false);
    const [minutes, seconds] = inputTime.split(":").map(Number);

    if (!isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0) {
      const totalSeconds = minutes * 60 + seconds;
      setSeconds(totalSeconds);
      setSetTime(totalSeconds); // Correctly set total time
      setInputTime("");
      setIsActive(false);
      setEndTime(null);
    } else {
      alert("Please Enter a valid time in MM:SS format");
      setInputTime("");
    }
  };

  const logSession = async () => {
    if (!currentDay) {
      alert("Error: Unable to determine the current day.");
      return;
    }
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    const sessionTime = Math.max(setTime - seconds, 0);

    try {
      await axios.post("https://todo-app-xvg1.onrender.com/work_logs", {
        seconds: sessionTime
      });
      console.log(`Logged ${sessionTime} seconds`);
      triggerTallyRefresh();
    } catch (err) {
        console.error("Failed to log work session:", err);
        alert("Failed to log session.");
    }

    reset();
    setLogPopup(false);
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
      {logPopup && (
        <div className="modal">
          <div className="modal-content">
            <h3>Session Completed!</h3>
            <p>Would you like to log this session of {formatTime(setTime)}?</p>
            <div className="modal-buttons">
              <button onClick={logSession}>Log Session</button>
              <button onClick={() => reset()}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
