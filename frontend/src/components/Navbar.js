import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setAccount }) => {
    const navigate = useNavigate();

    const logout = () => {
        setAccount(null);  
        navigate('/');    
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#000000' }}>
            <nav className="navbar navbar-expand-lg bg-light rounded shadow-sm">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/file-storage')}>Home</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/file-storage/upload')}>Upload File</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => navigate('/file-storage/list')}>List Files</button>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="btn btn-danger" onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
