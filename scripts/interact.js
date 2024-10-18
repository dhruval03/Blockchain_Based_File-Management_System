const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = provider.getSigner();
  const contractAddress = "0x574e9d8234fD3f4f0042BF77A7AF519986F18bC7";
  const abi = [
    // Add your ABI here (from the compiled contract in artifacts)
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "addFile",
      "outputs": [], 
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fileCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "files",
      "outputs": [
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_fileId",
          "type": "uint256"
        }
      ],
      "name": "getFile",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Store the IPFS hash on the blockchain
  const ipfsHash = "QmbMZuu2ekzjewTWFbD5U42BcdgCejmt5uHjYXGiTrcJm8";
  const tx = await contract.addFile(ipfsHash);
  await tx.wait();
  console.log(`IPFS hash stored with transaction: ${tx.hash}`);

  // Retrieve the stored IPFS hash
  const fileId = 1;
  const [retrievedHash, owner] = await contract.getFile(fileId);
  console.log(`Retrieved IPFS hash: ${retrievedHash}, Owner: ${owner}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
