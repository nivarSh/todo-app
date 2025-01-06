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
    const lastResetDate = localStorage.getItem("last-reset-date");
    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    if (lastResetDate) {
      const lastReset = new Date(lastResetDate);
      const lastResetDay = lastReset.getDay();
      const diffInDays = (currentDate - lastReset) / (1000 * 60 * 60 * 24);

      if (currentDay === 1 && (lastResetDay !== 1 || diffInDays >= 7)) {
        updateTallyTime({
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0,
        }); // Reset tallyTime for the entire week
        localStorage.setItem("last-reset-date", currentDate.toISOString());
      }
    } else {
      localStorage.setItem("last-reset-date", currentDate.toISOString());
    }
  };

  useEffect(() => {
    const storedTallyTime = localStorage.getItem("user-tally-time");
    if (storedTallyTime) {
      setTallyTime(JSON.parse(storedTallyTime)); // Load stored tally time
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
      setTallyTime(defaultTallyTime); // Set default values
      localStorage.setItem("user-tally-time", JSON.stringify(defaultTallyTime)); // Save defaults to localStorage
    }
    resetWeeklyTally();
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
