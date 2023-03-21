import { ethers } from "ethers";

// Set up Ethereum provider
const provider = new ethers.providers.JsonRpcProvider();

// Set up NFT contract
const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider);

// Check if address holds NFT
const holdsNFT = await nftContract.ownerOf(nftTokenId) === address;

if (holdsNFT) {
  console.log(`Address ${address} holds NFT with token ID ${nftTokenId}`);
} else {
  console.log(`Address ${address} does not hold NFT with token ID ${nftTokenId}`);
}
