import { Navbar } from "./components/Navbar";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { TodoList } from "./components/TodoList";
import { TodoInput } from "./components/TodoInput";
import { Timer } from "./components/Timer";
import { Tally } from "./components/Tally";

import axios from "axios";

import { useState, useEffect } from "react";
import { Quote } from "./components/Quote";

function App() {
  const [selectedTab, setSelectedTab] = useState("Open");
  const [tallyRefreshFlag, setTallyRefreshFlag] = useState(0);

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


  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(localStorage.getItem("username"))
    const fetchTallyTime = async () => {
      try {
        const res = await axios.get("http://localhost:5000/work_logs/weekly", {
          withCredentials: true,
        });
  
        const backendData = res.data;
        const converted = {
          Monday: Math.round((backendData.Monday || 0)),
          Tuesday: Math.round((backendData.Tuesday || 0)),
          Wednesday: Math.round((backendData.Wednesday || 0)),
          Thursday: Math.round((backendData.Thursday || 0)),
          Friday: Math.round((backendData.Friday || 0)),
          Saturday: Math.round((backendData.Saturday || 0)),
          Sunday: Math.round((backendData.Sunday || 0)),
        };

        console.log(converted)
  
        setTallyTime(converted);
      } catch (err) {
        console.error("Failed to fetch weekly tally:", err);
      }
    };
  
    fetchTallyTime();
  }, [tallyRefreshFlag]);

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
        <Navbar />
        <div className="header-logout-container">
            <Header todos={todos} username={username} />
        </div>
        <Timer
            currentDay={currentDay}
            triggerTallyRefresh={() => setTallyRefreshFlag(prev => prev + 1)}
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
