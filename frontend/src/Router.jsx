// Router.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import ProtectedApp from "./ProtectedApp.jsx";
import History from "./History.jsx";
// import App from "./App.jsx";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedApp />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
