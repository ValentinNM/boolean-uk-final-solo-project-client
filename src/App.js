import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";

export default function App() {
  
  const [authUser, setAuthUser] = useState(null);

  return (
    <div>
      <main>
        <Routes>
          <Route
            path="/signup"
            element={<SignUp setAuthUser={setAuthUser} />}
          />
          <Route
            path="/login"
            element={<LogIn authUser={authUser} setAuthUser={setAuthUser} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard authUser={authUser} />}
          />
          <Route path="/really-not-found" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
