import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import HomePage from './pages/HomePage';
import UploadFilePage from './pages/FileStorage';
import ListFilesPage from './pages/ListFilesPage';
import Navbar from './components/Navbar';

// ProtectedRoute component
const ProtectedRoute = ({ account, children }) => {
    if (!account) {
        alert('Please log in to access this page.');
        return <Navigate to='/' replace />;
    }
    return children;
};

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
                <Route 
                    path="/file-storage" 
                    element={
                        <ProtectedRoute account={account}>
                            <HomePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/file-storage/upload" 
                    element={
                        <ProtectedRoute account={account}>
                            <UploadFilePage account={account} setAccount={setAccount} />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/file-storage/list" 
                    element={
                        <ProtectedRoute account={account}>
                            <ListFilesPage account={account} setAccount={setAccount} />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </>
    );
};

const App = () => {
    const [account, setAccount] = useState(null);
    const [privateKey, setPrivateKey] = useState("");

    // Persist login state
    useEffect(() => {
        const savedAccount = localStorage.getItem('account');
        const savedPrivateKey = localStorage.getItem('privateKey');
        
        // Only set account if both account and private key are present
        if (savedAccount && savedPrivateKey) {
            setAccount(JSON.parse(savedAccount));
            setPrivateKey(savedPrivateKey);
        }
    }, []);

    // Save to localStorage on login
    useEffect(() => {
        if (account) {
            localStorage.setItem('account', JSON.stringify(account));
            localStorage.setItem('privateKey', privateKey);
        } else {
            // Clear storage if logged out
            localStorage.removeItem('account');
            localStorage.removeItem('privateKey');
        }
    }, [account, privateKey]);

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
