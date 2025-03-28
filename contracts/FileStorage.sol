// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FileStorage {
    struct File {
        string ipfsHash;
        address owner;
        uint256 timestamp;
        string fileName;   
        string fileType;   
        string description;
    }

    mapping(uint256 => File) public files;
    mapping(address => uint256[]) public userFiles; 
    uint256 public fileCount;

    // Events to log file actions
    event FileAdded(
        uint256 indexed fileId, 
        address indexed owner, 
        string ipfsHash, 
        uint256 timestamp,
        string fileName, 
        string fileType,
        string description
    );
    event FileRemoved(uint256 indexed fileId, address indexed owner);
    event FileOwnershipTransferred(uint256 indexed fileId, address indexed previousOwner, address indexed newOwner);

    // Add File to the contract
    function addFile(
        string memory _ipfsHash, 
        string memory _fileName, 
        string memory _fileType, 
        string memory _description
    ) public {
        fileCount++;
        files[fileCount] = File({
            ipfsHash: _ipfsHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            fileName: _fileName,
            fileType: _fileType,
            description: _description
        });
        userFiles[msg.sender].push(fileCount);

        emit FileAdded(fileCount, msg.sender, _ipfsHash, block.timestamp, _fileName, _fileType, _description);
    }

    // Get File information by its ID
    function getFile(uint256 _fileId) public view returns (
        string memory, 
        address, 
        uint256, 
        string memory, 
        string memory, 
        string memory
    ) {
        File memory file = files[_fileId];
        return (file.ipfsHash, file.owner, file.timestamp, file.fileName, file.fileType, file.description); // Return file metadata along with IPFS hash and owner
    }

    // Remove File from the contract (only by the owner)
    function removeFile(uint256 _fileId) public {
        require(files[_fileId].owner == msg.sender, "Only the owner can remove the file");

        // Emit event before removing
        emit FileRemoved(_fileId, msg.sender);
        delete files[_fileId];

        // Remove file ID from the user's file list
        uint256[] storage userFileIds = userFiles[msg.sender];
        for (uint i = 0; i < userFileIds.length; i++) {
            if (userFileIds[i] == _fileId) {
                userFileIds[i] = userFileIds[userFileIds.length - 1];
                userFileIds.pop();
                break;
            }
        }
    }

    // Get a list of File IDs owned by the user
    function getUserFiles() public view returns (uint256[] memory) {
        return userFiles[msg.sender];
    }

    // Get total file count owned by the user
    function getUserFileCount() public view returns (uint256) {
        return userFiles[msg.sender].length;
    }
}
