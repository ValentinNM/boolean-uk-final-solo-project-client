import './App.css';
import {Routes, Route} from "react-router-dom"
import {useState, useEffect} from 'react';
import SignUp from './Pages/SignUp';

export default function App() {

    const [assets, setAssets] = useState([])
    const [authUser, setAuthUser] = useState(null)

    return (
        <div>
            <header></header>
            <main>
                <Routes>
                    <Route path="/signup"
                        element={<SignUp setAuthUser={setAuthUser} />} />
                </Routes>
            </main>
        </div>
    );
}
