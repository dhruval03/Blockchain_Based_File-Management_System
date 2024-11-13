import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import LoginPage from './auth/LoginPage';
import HomePage from './pages/HomePage';
import UploadFilePage from './pages/FileStorage';
import ListFilesPage from './pages/ListFilesPage';
import Navbar from './components/Navbar';

const AppRoutes = ({ account, setAccount, privateKey, setPrivateKey }) => {
    const location = useLocation();

    return (
        <>
            {location.pathname !== '/' && <Navbar account={account} setAccount={setAccount} />}
            <Routes>
                <Route 
                    path="/" 
                    element={<LoginPage setAccount={setAccount} setPrivateKey={setPrivateKey} />} 
                />
                <Route path="/file-storage" element={<HomePage />} />
                <Route path="/file-storage/upload" element={<UploadFilePage account={account} setAccount={setAccount} />} />
                <Route path="/file-storage/list" element={<ListFilesPage account={account} setAccount={setAccount} />} />
            </Routes>
        </>
    );
};

const App = () => {
    const [account, setAccount] = useState(null);
    const [privateKey, setPrivateKey] = useState("");

    return (
        <Router>
            <AppRoutes 
                account={account} 
                setAccount={setAccount} 
                privateKey={privateKey} 
                setPrivateKey={setPrivateKey} 
            />
        </Router>
    );
};

export default App;
