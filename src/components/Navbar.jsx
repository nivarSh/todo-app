import { useNavigate } from "react-router-dom";

export function Navbar() {

    const navigate = useNavigate();

    return (
        <div className="navbar background-gradient">
        <div className="navbar-left">
            <h2 className="app-title" onClick={() => navigate("/")}>DeepWork</h2>
        </div>
        <div className="navbar-right">
            <button onClick={() => navigate("/history")}>
                History
            </button>
        </div>
        </div>
    )
}