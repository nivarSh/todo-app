import { Navbar } from "./components/Navbar";
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
        const fetchWeekly = () => {
          setLoading(true);

            // 1. GET user-tally-time from localStorage
            const weeklyString = localStorage.getItem("user-tally-time")

            // 2. Format Weekly Tally for recharts (expects data to be an array)
            const weeklyObj = JSON.parse(weeklyString); // parse into obj

            const weeklyArray = Object.entries(weeklyObj).map(
                ([day, seconds]) => ({ 
                    day,
                    minutes: Math.round(seconds / 60)
                 })
              );

            // 3. Update WeeklyData
            setWeeklyData(weeklyArray)

          setLoading(false);
        };

        const fetchHistory = () => {
            const historyString = localStorage.getItem("history");
            if (!historyString) {
              setHistory([]);
              return;
            }
          
            // parse JSON into an array
            let parsed;
            try {
              parsed = JSON.parse(historyString);
            } catch {
              console.error("Invalid history JSON");
              setHistory([]);
              return;
            }
          
            // if it’s an array of { timestamp, seconds } objects, map directly
            const historyArray = Array.isArray(parsed)
              ? parsed.map(({ timestamp, seconds }) => ({
                  timestamp,
                  seconds,
                }))
              : [];
          
            setHistory(historyArray);
          };
          
      
        fetchWeekly();
        fetchHistory();
      }, []);      

    return (
        <>
            <Navbar />
            <div style={{ padding: "0rem" }}>
                <h1 style={{ marginBottom: "3rem", }} className="text-gradient">Your Work Session Data</h1>
                
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
                <p className="errormsghis">No work sessions yet.</p>
                ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginLeft: "0.5rem" }}>
                    <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: "0.5rem" }}>Timestamp</th>
                        <th style={{ textAlign: "left", padding: "0.5rem" }}>Seconds</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((entry, idx) => (
                        <tr key={idx}>
                        <td style={{ padding: "0.5rem" }}>{entry.timestamp}</td>
                        <td style={{ padding: "0.5rem" }}>{entry.seconds}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>
            
        </>
    )
}