import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import abi from '../FileStorageABI.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileStorage.css';

const CONTRACT_ADDRESS = "0x95ce41Fe4be3034A8873543481ae1e71A59D37F0";
const PINATA_API_KEY = "153f3971c2476bcdeb52";
const PINATA_SECRET_KEY = "085fe5572c5a923b691799caab6df5b6284f5c306a407bfc2dc939bd65e45dec";

const UploadFilePage = ({ account, setAccount }) => {
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();  

    const uploadToIPFS = async () => {
        if (!file) {
            toast.error('Please select a file to upload.'); 
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                },
            });

            const hash = response.data.IpfsHash;
            setIpfsHash(hash);
            toast.success(`File uploaded! IPFS Hash: ${hash}`); 
        } catch (err) {
            console.error("Error uploading file to IPFS:", err);
            toast.error("Error uploading file to IPFS. Please try again."); 
        }
    };

    const addFile = async () => {
        if (!account) {
            toast.error('Please login with your Ganache account first.'); 
            return;
        }

        // Validation: Check if ipfsHash is empty
        if (!ipfsHash) {
            toast.error('IPFS Hash is empty. Please upload a file first.'); // Use toast for error notification
            return;
        }

        // Validation: Check if the description is empty
        if (!description) {
            toast.error('Please enter a description for the file.'); // Use toast for error notification
            return;
        }

        // Automatically set file name and type from the uploaded file
        const fileName = file.name;
        const fileType = file.type;

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, account);
        
        try {
            const tx = await contract.addFile(ipfsHash, fileName, fileType, description);
            await tx.wait();
            toast.success("File metadata stored successfully!"); 
            setIpfsHash('');
            setFile(null); 
            setDescription('');
        } catch (err) {
            console.error("Error storing file metadata:", err);
            toast.error("Error storing file metadata. Please ensure the contract is deployed and you have entered all required fields."); // Use toast for error notification
        }
    };

    return (
        <div className="upload-container"> 
            <ToastContainer /> 
            <div className="container mt-5">
                <h1 className="text-center title mb-4" style={{ color: '#d4eaff'}}>Upload File</h1> 
                <div className="row d-flex justify-content-center">
                    <div className="col-md-6 mb-4">
                        <div className="card p-4">
                            <input 
                                type="file" 
                                className="form-control mb-3" 
                                onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    setFile(selectedFile); 
                                }} 
                            />
                            <button 
                                className="btn btn-primary w-100 mb-3" 
                                onClick={uploadToIPFS}
                            >
                                Upload to IPFS
                            </button>

                            <input
                                type="text"
                                value={ipfsHash}
                                readOnly
                                className="form-control mb-3"
                                placeholder="IPFS Hash will appear here"
                            />
                            
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-control mb-3"
                                placeholder="Description"
                                rows="3"
                                required
                            ></textarea>

                            <button 
                                className="btn btn-success w-100" 
                                onClick={addFile}
                            >
                                Store File Metadata
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadFilePage;
