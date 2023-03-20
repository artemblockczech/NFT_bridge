import { ethers } from 'ethers';

// Provided ABI
const contractAbi = [/*... ABI content here ...*/];

// Connect to Ethereum
const provider = new ethers.providers.InfuraProvider('mainnet', 'YOUR_INFURA_API_KEY');

async function getNFTMetadata(contractAddress: string, tokenId: number): Promise<string> {
  try {
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    const tokenURI = await contract.tokenURI(tokenId);
    return tokenURI;
  } catch (error) {
    console.error('Error getting NFT metadata:', error);
    return '';
  }
}
  
<!-- 
#TEST
(async () => {
  const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
  const tokenId = 1;

  const tokenURI = await getNFTMetadata(contractAddress, tokenId);
  console.log('Token URI:', tokenURI);
})(); -->
