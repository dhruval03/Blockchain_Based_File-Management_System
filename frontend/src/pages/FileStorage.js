import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import abi from '../FileStorageABI.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileStorage.css';

const CONTRACT_ADDRESS = "0x72FE5a5B8d894CD1360C6CB035F6F89aa5b3cA63";
const PINATA_API_KEY = "f8e3104ab1788d402885";
const PINATA_SECRET_KEY = "6964c6854c5bf87e95dcb5a3753a3cee2aef2ac411b8b71fe5aaaabd156490c1";
const ETH_RATE_PER_KB = 0.00000000001957;

const UploadFilePage = ({ account, setAccount }) => {
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handlePayment = async (costInEth) => {
        try {
            if (!window.ethereum) throw new Error("MetaMask is not installed.");
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const transaction = await signer.sendTransaction({
                to: CONTRACT_ADDRESS,
                value: ethers.parseEther(costInEth.toString())
            });
            await transaction.wait();
            toast.success('Payment successful. Uploading file to IPFS...');
            return true; 
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Payment failed. Please try again.');
            return false;
        }
    };

    const uploadToIPFS = async () => {
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        const fileSizeInKB = file.size / 1024;
        if (fileSizeInKB <= 0) {
            toast.error('File size is too small or invalid.');
            return;
        }

        const costInEth = fileSizeInKB * ETH_RATE_PER_KB;
        const formattedCost = costInEth.toFixed(18);

        const userConfirmed = window.confirm(
            `The cost of storing this file on IPFS is approximately ${formattedCost} ETH.\nDo you want to proceed?`
        );

        if (!userConfirmed) {
            toast.info('File upload cancelled by the user.');
            return;
        }

        const paymentSuccess = await handlePayment(formattedCost);
        if (!paymentSuccess) return;

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
            console.error('Error uploading file to IPFS:', err);
            toast.error('Error uploading file to IPFS. Please try again.');
        }
    };
    

    const addFile = async () => {
        if (!account) {
            toast.error('Please login with your account first.');
            return;
        }
    
        // Validation: Check if ipfsHash is empty
        if (!ipfsHash) {
            toast.error('IPFS Hash is empty. Please upload a file first.');
            return;
        }
    
        // Validation: Check if the description is empty
        if (!description) {
            toast.error('Please enter a description for the file.');
            return;
        }
    
        // Automatically set file name and type from the uploaded file
        const fileName = file.name || "Unnamed File";
        const fileType = file.type || "Unknown Type";
    
        // Calculate the metadata size in bytes
        const metadataSizeBytes = new TextEncoder().encode(`${ipfsHash}${fileName}${fileType}${description}`).length;
    
        // Estimate gas cost based on metadata size
        const estimatedGas = 21000 + metadataSizeBytes * 68; // Base gas + dynamic cost for storage
    
        // Use a fixed gas price of 20 gwei, manually converting gwei to wei (1 gwei = 1,000,000,000 wei)
        const fixedGasPriceWei = 20 * 10 ** 9; // 20 gwei in wei
        const estimatedCostInWei = fixedGasPriceWei * estimatedGas;
    
        // Calculate additional 7% charges
        const extraChargesInWei = (estimatedCostInWei * 7) / 100;
    
        // Total cost including extra charges
        const totalCostInWei = estimatedCostInWei + extraChargesInWei;
        const totalCostInEth = totalCostInWei / 10 ** 18;
    
        // Display cost confirmation to the user
        const userConfirmed = window.confirm(
            `The estimated cost of storing this file's metadata on the blockchain is approximately ${totalCostInEth.toFixed(6)} ETH.\n\nMetadata Details:\n- File Name: ${fileName}\n- File Type: ${fileType}\n- Description Length: ${description.length} characters\n- IPFS Hash: ${ipfsHash}\n\nDo you want to proceed?`
        );
    
        if (!userConfirmed) {
            toast.info('Metadata storage cancelled by the user.');
            return;
        }
    
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
            toast.error("Error storing file metadata. Please ensure the contract is deployed and you have entered all required fields.");
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
