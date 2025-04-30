import { Navbar } from "./components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    LineChart,
    Line
  } from "recharts";
  

export default function History() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false)
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        const fetchWeekly = async () => {
          setLoading(true);
          try {
            const res = await axios.get("https://todo-app-xvg1.onrender.com/work_logs/weekly", {
              withCredentials: true,
            });
      
            const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const data = WEEKDAYS.map(day => ({
              day,
              minutes: Math.round((res.data[day] || 0) / 60),
            }));
      
            setWeeklyData(data);
          } catch (err) {
            console.error("Weekly data load failed", err);
          } finally {
            setLoading(false);
          }
        };
      
        fetchWeekly();
      }, []);      

    // useEffect, get all history data and display as a table
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
          try {
            const res = await axios.get("https://todo-app-xvg1.onrender.com/work_logs/history", {
              withCredentials: true,
            });
            console.log(res.data);
            setHistory(res.data);
          } catch (err) {
            console.log("history load failed", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchHistory();
      }, []);

    return (
        <>
            <Navbar />
            <div style={{ padding: "0rem" }}>
                <h2 style={{ marginBottom: "3rem", margin: "0 auto", }} className="text-gradient">Your Work Session Data</h2>
                
                {!loading && weeklyData.length > 0 && (
                <div style={{ width: "100%", height: 350, marginTop: "2rem" }}>
                    <ResponsiveContainer>
                    <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis
                            width={30} // adjust between 30–50
                        />

                        <Tooltip
                            contentStyle={{
                                height: "75px",
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "10px",
                                fontSize: "0.9rem",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                            }}
                            labelStyle={{
                                fontWeight: "bold",
                                color: "#333",
                            }}
                            itemStyle={{
                                color: "#333"
                            }}
                            />
                        <Line dataKey="minutes" stroke="#fa6060" strokeWidth={3} />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                )}
                
                {loading ? (
                <p></p>
                ) : history.length === 0 ? (
                <p>No work sessions yet.</p>
                ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
                        <th style={{ textAlign: "left", padding: "0.5rem" }}>Minutes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((entry, idx) => (
                        <tr key={idx}>
                        <td style={{ padding: "0.5rem" }}>{entry.date}</td>
                        <td style={{ padding: "0.5rem" }}>{Math.round(entry.seconds / 60)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>
            
        </>
    )
}