async function main() {
    const FileStorage = await ethers.getContractFactory("FileStorage");
    const fileStorage = await FileStorage.deploy();
    
    // Wait for the contract to be mined
    await fileStorage.deployTransaction.wait();
  
    console.log("FileStorage deployed to:", fileStorage.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  