import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { TodoList } from "./components/TodoList";
import { TodoInput } from "./components/TodoInput";
import { Timer } from "./components/Timer";
import { Tally } from "./components/Tally";

import { useState, useEffect } from "react";
import { Quote } from "./components/Quote";

function App() {
  const [selectedTab, setSelectedTab] = useState("Open");

  const [todos, setTodos] = useState([
    { input: "Hello! Add your first todo!", complete: true },
  ]);

  const [tallyTime, setTallyTime] = useState({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  });

  // Calculate current day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[new Date().getDay()];

  // Function to update tallyTime
  const updateTallyTime = (newTallyTime) => {
    setTallyTime(newTallyTime);
    localStorage.setItem("user-tally-time", JSON.stringify(newTallyTime));
  };

  // Function to reset the tallyTime weekly on Monday
  const resetWeeklyTally = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Get current day (0 = Sunday, 1 = Monday, etc.)

    const lastResetDate = localStorage.getItem("last-reset-date");

    if (currentDay === 1) {
      // Check if today is Monday
      if (lastResetDate) {
        const lastReset = new Date(lastResetDate);

        // Only reset if it's a new Monday (not the same Monday as last reset)
        if (
          currentDate.toDateString() !== lastReset.toDateString() ||
          currentDate - lastReset > 6 * 24 * 60 * 60 * 1000 // Ensure it's been a full week
        ) {
          // Reset tallyTime for the week
          updateTallyTime({
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0,
          });
          localStorage.setItem("last-reset-date", currentDate.toISOString());
        }
      } else {
        // No last reset date found, set it for the first time
        localStorage.setItem("last-reset-date", currentDate.toISOString());
      }
    }
  };

  useEffect(() => {
    const storedTallyTime = localStorage.getItem("user-tally-time");
    if (storedTallyTime) {
      setTallyTime(JSON.parse(storedTallyTime));
    } else {
      const defaultTallyTime = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      };
      setTallyTime(defaultTallyTime);
      localStorage.setItem("user-tally-time", JSON.stringify(defaultTallyTime));
    }
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 1 = Monday
  
    if (currentDay === 1) {
      const lastResetDate = localStorage.getItem("last-reset-date");
  
      const hasBeenResetToday = lastResetDate &&
        new Date(lastResetDate).toDateString() === currentDate.toDateString();
  
      if (!hasBeenResetToday) {
        const reset = {
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0,
        };
        setTallyTime(reset);
        localStorage.setItem("user-tally-time", JSON.stringify(reset));
        localStorage.setItem("last-reset-date", currentDate.toISOString());
      }
    }
  }, []);  

  function handleAddTodo(newTodo) {
    const newTodoList = [...todos, { input: newTodo, complete: false }];
    setTodos(newTodoList);
    handleSaveData(newTodoList);
  }

  function handleCompleteTodo(index) {
    let newTodoList = [...todos];
    let completedTodo = todos[index];
    completedTodo["complete"] = true;
    newTodoList[index] = completedTodo;
    setTodos(newTodoList);
    handleSaveData(newTodoList);
  }

  function handleDeleteTodo(index) {
    let newTodoList = todos.filter((val, valIndex) => valIndex !== index);
    setTodos(newTodoList);
    handleSaveData(newTodoList);
  }

  function handleSaveData(currTodos) {
    localStorage.setItem("todo-app", JSON.stringify({ todos: currTodos }));
  }

  useEffect(() => {
    if (!localStorage || !localStorage.getItem("todo-app")) {
      return;
    }
    let db = JSON.parse(localStorage.getItem("todo-app"));
    setTodos(db.todos);
  }, []);

  return (
    <>
      <Header todos={todos} />
      <Timer
        tallyTime={tallyTime}
        updateTallyTime={updateTallyTime}
        currentDay={currentDay}
      />
      <Tabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        todos={todos}
      />
      <TodoList
        todos={todos}
        selectedTab={selectedTab}
        handleDeleteTodo={handleDeleteTodo}
        handleCompleteTodo={handleCompleteTodo}
      />
      <TodoInput handleAddTodo={handleAddTodo} />
      <Tally tallyTime={tallyTime} />
      <Quote />
    </>
  );
}

export default App;
