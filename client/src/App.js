import React from 'react';
import './App.css';
import Mypage from './Mypage';
import Top from './Top';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Top />} />
                    <Route path="/mypage" element={<Mypage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;