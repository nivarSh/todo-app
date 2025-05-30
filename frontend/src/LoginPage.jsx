import { useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { SlGraph } from "react-icons/sl";


export default function LoginPage({ onLoginSuccess }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await axios.post("https://todo-app-xvg1.onrender.com/login", {username, password})
            localStorage.setItem("username", username);
            onLoginSuccess(); // Let Router know that login is successful, -> switch to homepage
        } catch (err) {
            alert("login failed")
        }
    }

    const handleSignup = async () => {
        try {
            await axios.post("https://todo-app-xvg1.onrender.com/signup", {username, password})
            localStorage.setItem("username", username);
            onLoginSuccess(); // Let Router know that signup is successful, -> switch to homepage
        } catch (err) {
            alert("signup failed")
        }
    }

    return (
        <>
            <div className="about">
                <h1 className="text-gradient">DeepWork</h1>
                <p>
                    Science-based tool aimed at enhancing productivity.
                </p>
                <div className="info-card-container">
                    <div>
                        <p className="headerinfo">Customizable Timer</p>
                        <p>Simple timers designed around timeboxing and Parkinson’s Law to maximize efficiency.</p>
                        <IoIosTimer size={44}/>
                    </div>
                    <div>
                    <p className="headerinfo">Task Lists</p>
                    <p>Organize your day with simple task lists that guide each session and reduce decision fatigue.</p>
                        <FaPencilAlt size={40}/>
                    </div>
                    <div>
                        <p className="headerinfo">Data Visualizations</p>
                        <p>Track your weekly progress with visual insights that reinforce consistency and reveal trends.</p>
                        <SlGraph size={44}/>
                    </div>
                </div>
            </div>
            <div className="login-container">
                <h3>Login or Sign Up</h3>
                <div className="input-ctr">
                    <input
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="btn-ctr">
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleSignup}>Register</button>
                </div>
        </div>
        </>
    )
}