import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import NotFound from "./Pages/NotFound";
import Validation from "./Pages/Validation";
import Home from "./Components/Home";

export default function App() {
  const [authUser, setAuthUser] = useState(null);

  return (
    <div>
      <main>
        <Routes>
           <Route path="/login" element ={<LogIn setAuthUser={setAuthUser}/>} />
          <Route
            path="/signup"
            element={<SignUp setAuthUser={setAuthUser} />}
          />
          <Route path="/register" element={<Validation />} />
           <Route path = "/*"  element={ <Home authUser={authUser}/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
