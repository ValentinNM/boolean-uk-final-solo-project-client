import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import NotFound from "./Pages/NotFound";
import Validation from "./Pages/Validation";
import Home from "./Components/Home";
import { Navigate } from "react-router-dom";

export default function App() {
  const [authUser, setAuthUser] = useState(null);

  return (
    <div>
      <main>
        <Routes>
           <Route path="/login" element ={<LogIn setAuthUser={setAuthUser}/>} />
          <Route path="/signup" element={<SignUp setAuthUser={setAuthUser} />} />
          { authUser && <Route path="/register" element={<Validation />} />}
          <Route path = "/*"  element={ authUser ? <Home setAuthUser={setAuthUser} authUser={authUser}/> : <Navigate to="/login" />} />  
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
