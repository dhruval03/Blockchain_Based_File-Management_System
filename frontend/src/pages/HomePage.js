// HomePage.js
import React from 'react';
import './HomePage.css';
const HomePage = ({ account, setAccount }) => {
    return (
            <div className="homepage-container">
                <div className="hero-section">
                    <h1 className="hero-title">Welcome to the FileLedger</h1>
                    <p className="hero-subtitle">Securely store and manage your files with ease.</p>
                </div>
                <div className="features-section">
                    <div className="feature-card">
                        <h3>Upload Files</h3>
                        <p>Effortlessly upload your files to the decentralized network.</p>
                    </div>
                    <div className="feature-card">
                        <h3>List Files</h3>
                        <p>View and manage your uploaded files seamlessly.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Secure Access</h3>
                        <p>Your files are protected with state-of-the-art security protocols.</p>
                    </div>
                </div>
            </div>
    );
};

export default HomePage;
