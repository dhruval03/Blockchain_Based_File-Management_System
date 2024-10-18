import { ethers } from 'ethers';

// Connect to local Ethereum provider
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Retrieve list of accounts
provider.listAccounts().then(accounts => {
  console.log('Accounts:', accounts);
});
