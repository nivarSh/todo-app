import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Navbar() {

    const navigate = useNavigate();

      const handleLogout = async () => {
        try {
            axios.post("https://todo-app-xvg1.onrender.com/logout")
            window.location.href = "/"; // full reload to root
        } catch {
            alert("logout failed")
        }
      }

    return (
        <div className="navbar background-gradient">
        <div className="navbar-left">
            <h2 className="app-title" onClick={() => navigate("/")}>DeepWork</h2>
        </div>
        <div className="navbar-right">
            <button onClick={() => navigate("/history")}>
                History
            </button>
            <button onClick={handleLogout}>
            Logout
            </button>
        </div>
        </div>
    )
}