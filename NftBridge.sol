pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTBridge is IERC721Receiver, Ownable {
    // Events emitted for locked, unlocked, and minted NFTs
    event NFTLocked(address indexed sourceChain, address indexed owner, uint256 indexed tokenId, bytes32 targetChain);
    event NFTUnlocked(address indexed sourceChain, address indexed owner, uint256 indexed tokenId, bytes32 targetChain);
    event NFTMinted(address indexed targetChain, address indexed owner, uint256 indexed tokenId, bytes32 sourceChain);

    // Struct to store NFT data during the bridge process
    struct NFTData {
        address sourceChain;
        uint256 tokenId;
        address owner;
        bytes32 targetChain;
    }

    // Mapping of locked NFTs indexed by a unique lockId
    mapping(bytes32 => NFTData) public lockedNFTs;

    // Function to lock an NFT on the source chain
    function lockNFT(address sourceChain, uint256 tokenId, bytes32 targetChain) external {
        // Ensure that the caller owns the NFT
        require(IERC721(sourceChain).ownerOf(tokenId) == msg.sender, "Caller is not the owner of the NFT.");
        
        // Safely transfer the NFT from the owner to the bridge contract
        IERC721(sourceChain).safeTransferFrom(msg.sender, address(this), tokenId);
        
        // Generate a unique lockId for this NFT
        bytes32 lockId = keccak256(abi.encodePacked(sourceChain, tokenId, msg.sender, targetChain, block.number));
        
        // Store the locked NFT data in the mapping
        lockedNFTs[lockId] = NFTData(sourceChain, tokenId, msg.sender, targetChain);
        
        // Emit the NFTLocked event
        emit NFTLocked(sourceChain, msg.sender, tokenId, targetChain);
    }

    // Function to unlock an NFT on the source chain
    function unlockNFT(bytes32 lockId) external onlyOwner {
        // Get the NFT data from the mapping
        NFTData storage nftData = lockedNFTs[lockId];
        
        // Ensure that the lockId is valid
        require(nftData.owner != address(0), "Invalid lockId.");
        
        // Safely transfer the NFT back to the owner
        IERC721(nftData.sourceChain).safeTransferFrom(address(this), nftData.owner, nftData.tokenId);
        
        // Emit the NFTUnlocked event
        emit NFTUnlocked(nftData.sourceChain, nftData.owner, nftData.tokenId, nftData.targetChain);
        
        // Remove the NFT data from the mapping
        delete lockedNFTs[lockId];
    }
    
    // Function to mint a new NFT on the target chain
    function mintNFT(address targetChain, address owner, uint256 tokenId, bytes32 sourceChain) external onlyOwner {
        // Here, the minting process should be implemented for the specific NFT standard on the targetChain.
        // For example, for an ERC721 token, the _mint() function from the OpenZeppelin library should be used.
       // The metadata associated with the NFT should also be copied to the new token on the targetChain.
        
        // TODO: Implement the minting process for the specific NFT standard on the targetChain
        // Example: Call the mint() function of the target NFT contract to create a new NFT with the same metadata
        // as the original NFT on the sourceChain.
        
        // Emit the NFTMinted event
        emit NFTMinted(targetChain, owner, tokenId, sourceChain);
    }

    // Function to handle incoming ERC721 transfers (required by the IERC721Receiver interface)
    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        // Return the function selector to indicate successful ERC721 token receipt
        return this.onERC721Received.selector;
    }
}
