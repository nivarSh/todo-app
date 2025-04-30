import { useEffect, useState } from "react";
import axios from "axios";
import App from "./App.jsx";
import LoginPage from "./LoginPage.jsx";

axios.defaults.withCredentials = true; // allow cookies to go to Flask

export default function ProtectedApp() {
  
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
  
    useEffect(() => {
      axios.get("http://localhost:5000/me")
        .then(res => {
          if (res.data && res.data.user_id) {
            console.log(res.data)
            localStorage.setItem("username", res.data.username)
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoggedIn(false);
          setLoading(false);
        });
    }, []);
  
    if (loading) return <p></p>;
  
    return loggedIn ? <App /> : <LoginPage onLoginSuccess={() => setLoggedIn(true)} />;
  }