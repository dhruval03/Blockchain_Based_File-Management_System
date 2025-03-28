import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setAccount, setPrivateKey }) => {
    const [privateKey, setPrivateKeyLocal] = useState('');
    const navigate = useNavigate();

    const isValidPrivateKey = (key) => /^0x[a-fA-F0-9]{64}$/.test(key);

    // Function to handle login
    const handleLogin = async () => {
        if (!isValidPrivateKey(privateKey)) {
            alert('Invalid private key format');
            return;
        }

        try {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const wallet = new ethers.Wallet(privateKey, provider);
            setAccount(wallet);
            setPrivateKey(privateKey);
            console.log(`Logged in with account: ${wallet.address}`);
            alert(`Logged in with account: ${wallet.address}`);
            navigate('/file-storage');
        } catch (error) {
            console.error('Invalid private key:', error);
            alert('Failed to login. Please check your private key.');
        }
    };

    const handleSSOLogin = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAccount(signer);
                setPrivateKey(address);
                console.log(`Connected with MetaMask account: ${address}`);
                alert(`Connected with MetaMask account: ${address}`);
                navigate('/file-storage');
            } catch (error) {
                console.error('MetaMask connection failed:', error);
                alert('MetaMask connection failed.');
            }
        } else {
            alert('MetaMask not detected. Please install MetaMask to continue.');
        }
    };

    return (
        <div className="login-container">
            <div className="card glass-effect shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4 text-dark">Login to FileLedger</h2>
                    <p className="text-center text-muted mb-4">Enter your private key to access the file storage system.</p>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg glass-input"
                            placeholder="Enter your Private Key"
                            value={privateKey}
                            onChange={(e) => setPrivateKeyLocal(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary btn-lg w-100 mb-3" onClick={handleLogin}>Log In</button>
                    <button className="btn btn-secondary btn-lg w-100" onClick={handleSSOLogin}>Connect with MetaMask</button>
                    <div className="text-center mt-3">
                        <small className="text-muted">Your private key is kept secure and not shared.</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;