import './App.css';
import {Routes, Route} from "react-router-dom"
import {useState, useEffect} from 'react';
import SignUp from './Pages/SignUp';
import LogIn from './Pages/LogIn';
import Dashboard from './Pages/Dashboard'

export default function App() {

    const [assets, setAssets] = useState([])
    const [authUser, setAuthUser] = useState(null)

    return (
        <div>
            <main>
                <Routes>
                    <Route path="/signup"
                        element={<SignUp setAuthUser={setAuthUser} />} />
                    <Route path="/login"
                        element={<LogIn authUser={authUser} setAuthUser={setAuthUser} />} />
                    <Route path="/dashboard"
                        element={<Dashboard authUser={authUser} assets={assets} />} />
                </Routes>
            </main>
        </div>
    );
}
