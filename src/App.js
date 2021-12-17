import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import NotFound from "./Pages/NotFound";
import Validation from "./Pages/Validation";
import Home from "./Components/Home";
import { useEffect } from "react";

export default function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      setAuthUser(token)
    }
  }, [])

  return (
    <div>
      <main>
        <Routes>
          <Route path="/login" element ={<LogIn setAuthUser={setAuthUser}/>} />
          <Route path="/signup" element={<SignUp setAuthUser={setAuthUser} />} />
          {/* { !authUser.validated &&  */} {/* send validated through adn use jwt decode to keep track for limited access to Validation  page */}
          <Route path="/register" element={<Validation />} />
          {/* } */}
          {/* {  authUser &&  */}
          <Route path = "/*"  element={<Home setAuthUser={setAuthUser} authUser={authUser}/> } />  
          {/* } */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
