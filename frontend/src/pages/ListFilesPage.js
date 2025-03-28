import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import abi from '../FileStorageABI.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 

const CONTRACT_ADDRESS = "0x72FE5a5B8d894CD1360C6CB035F6F89aa5b3cA63";

// Pinata credentials (replace with your own API key and secret)
const PINATA_API_KEY = "f8e3104ab1788d402885";
const PINATA_SECRET_API_KEY = "6964c6854c5bf87e95dcb5a3753a3cee2aef2ac411b8b71fe5aaaabd156490c1";

// Function to unpin the file from Pinata
const unpinFileFromPinata = async (hash) => {
    const url = `https://api.pinata.cloud/pinning/unpin/${hash}`;

    try {
        const response = await axios.delete(url, {
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY
            }
        });
        console.log('File unpinned from Pinata:', response.data);
    } catch (error) {
        console.error('Error unpinning file from Pinata:', error);
        toast.error("Error unpinning file from Pinata.");
    }
};

const ListFilesPage = ({ account, setAccount }) => {
    const [fileDetails, setFileDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // If the account is not provided, redirect to the login page
        if (!account) {
            navigate('/');
        } else {
            listUserFiles();
        }
    }, [account, navigate]);

    const removeFile = async (id) => {
        if (!account) {
            toast.error('Please login with your Ganache account first.');
            return;
        }

        // Confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) {
            return; 
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, account);

        try {
            const tx = await contract.removeFile(id);
            await tx.wait();
            toast.success("File removed!");

            // After successfully removing the file on the blockchain, unpin it from Pinata
            const file = fileDetails.find(f => f.id === id);
            if (file) {
                await unpinFileFromPinata(file.hash);
            }

            listUserFiles();
        } catch (err) {
            console.error("Error removing file:", err);
            toast.error("Error removing file. Please try again.");
        }
    };

    const openFile = (hash) => {
        const url = `https://ipfs.io/ipfs/${hash}`;
        window.open(url, '_blank');
    };

    const listUserFiles = async () => {
        if (!account) {
            toast.error('Please login with your Ganache account first.');
            return;
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, account);

        try {
            const fileIds = await contract.getUserFiles();
            console.log("File IDs:", fileIds);

            // If no file IDs are found, log a message
            if (fileIds.length === 0) {
                toast.info("No files found for this account.");
            }

            const detailsPromises = fileIds.map(async (id) => {
                const [hash, owner, timestamp, fileName, fileType, description] = await contract.getFile(id);
                console.log(`File ID: ${id}, Hash: ${hash}, Owner: ${owner}, Name: ${fileName}, Type: ${fileType}, Description: ${description}`);
                return { id: id.toString(), hash, owner, timestamp, fileName, fileType, description };
            });
            const details = await Promise.all(detailsPromises);
            console.log("File Details:", details);
            setFileDetails(details);
        } catch (err) {
            console.error("Error retrieving user files:", err);
            toast.error("Error retrieving user files. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer /> 
            <h1 className="text-center mb-4">My Files</h1>
            <button className="btn btn-primary w-100 mb-4" onClick={listUserFiles}>List My Files</button>
            <div className="row">
                {fileDetails.length > 0 && (
                    fileDetails.map(({ id, hash, owner, fileName, fileType, description }) => (
                        <div key={id} className="col-md-12 mb-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title">File ID: {id}</h5>
                                    <p className="card-text"><strong>IPFS Hash:</strong> {hash}</p>
                                    <p className="card-text"><strong>Owner:</strong> {owner}</p>
                                    <p className="card-text"><strong>File Name:</strong> {fileName}</p>
                                    <p className="card-text"><strong>File Type:</strong> {fileType}</p>
                                    <p className="card-text"><strong>Description:</strong> {description}</p>
                                    <div className="d-flex justify-content-end">
                                        <FaExternalLinkAlt
                                            className="text-primary me-3"
                                            title="Open File"
                                            style={{ cursor: 'pointer', fontSize: '1.2em' }}
                                            onClick={() => openFile(hash)}
                                        />
                                        <FaTrash
                                            className="text-danger"
                                            title="Delete File"
                                            style={{ cursor: 'pointer', fontSize: '1.2em' }}
                                            onClick={() => removeFile(id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default ListFilesPage;
