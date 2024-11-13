import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setAccount, setPrivateKey }) => {  
    const [privateKey, setPrivateKeyLocal] = useState(''); 
    const navigate = useNavigate(); 

    // Function to handle login
    const handleLogin = () => {
        try {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const wallet = new ethers.Wallet(privateKey, provider);
            setAccount(wallet);
            setPrivateKey(privateKey);  
            alert(`Logged in with account: ${wallet.address}`);
            // Navigate to file storage page after successful login
            navigate('/file-storage');  
        } catch (error) {
            console.error('Invalid private key:', error);
            alert('Failed to login. Please check your private key.');
        }
    };

    return (
        <div className="login-container">
            <div className="card glass-effect shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4 text-dark">Login to File Storage</h2>
                    <p className="text-center text-muted mb-4">Enter your Ethereum private key to access the file storage system.</p>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg glass-input"
                            placeholder="Enter your Private Key"
                            value={privateKey}
                            onChange={(e) => setPrivateKeyLocal(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary btn-lg w-100 mb-3" onClick={handleLogin}>
                        Log In
                    </button>
                    <div className="text-center">
                        <small className="text-muted">Your private key is kept secure and not shared.</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
