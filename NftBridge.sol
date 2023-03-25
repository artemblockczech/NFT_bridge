pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTBridge is IERC721Receiver, Ownable {
    event NFTLocked(address indexed sourceChain, address indexed owner, uint256 indexed tokenId, bytes32 targetChain);
    event NFTUnlocked(address indexed sourceChain, address indexed owner, uint256 indexed tokenId, bytes32 targetChain);
    event NFTMinted(address indexed targetChain, address indexed owner, uint256 indexed tokenId, bytes32 sourceChain);

    struct NFTData {
        address sourceChain;
        uint256 tokenId;
        address owner;
        bytes32 targetChain;
    }

    mapping(bytes32 => NFTData) public lockedNFTs;

    function lockNFT(address sourceChain, uint256 tokenId, bytes32 targetChain) external {
        require(IERC721(sourceChain).ownerOf(tokenId) == msg.sender, "Caller is not the owner of the NFT.");
        IERC721(sourceChain).safeTransferFrom(msg.sender, address(this), tokenId);
        bytes32 lockId = keccak256(abi.encodePacked(sourceChain, tokenId, msg.sender, targetChain, block.number));
        lockedNFTs[lockId] = NFTData(sourceChain, tokenId, msg.sender, targetChain);
        emit NFTLocked(sourceChain, msg.sender, tokenId, targetChain);
    }

    function unlockNFT(bytes32 lockId) external onlyOwner {
        NFTData storage nftData = lockedNFTs[lockId];
        require(nftData.owner != address(0), "Invalid lockId.");
        IERC721(nftData.sourceChain).safeTransferFrom(address(this), nftData.owner, nftData.tokenId);
        emit NFTUnlocked(nftData.sourceChain, nftData.owner, nftData.tokenId, nftData.targetChain);
        delete lockedNFTs[lockId];
    }

    function mintNFT(address targetChain, address owner, uint256 tokenId, bytes32 sourceChain) external onlyOwner {
        // Here, the minting process should be implemented for the specific NFT standard on the targetChain.
        // For example, for an ERC721 token, the _mint() function from the OpenZeppelin library should be used.
        // The metadata associated with the NFT should also be copied to the new token on the targetChain.
        emit NFTMinted(targetChain, owner, tokenId, sourceChain);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
