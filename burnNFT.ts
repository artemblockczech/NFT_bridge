// burnNFT.ts
import { ethers } from 'ethers';

// Provided ABI
const contractAbi = [/*... ABI content here ...*/];

// Connect to Ethereum using Infura
// Replace 'YOUR_INFURA_API_KEY' with your actual Infura API key
const provider = new ethers.providers.InfuraProvider('mainnet', 'YOUR_INFURA_API_KEY');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

async function burnNFT(contractAddress: string, tokenId: number) {
  try {
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    const burnTx = await contract.burn(tokenId);
    await burnTx.wait();
    console.log('NFT burned successfully');
  } catch (error) {
    console.error('Error burning NFT:', error);
  }
}

<!-- (async () => {
  const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
  const tokenId = 1;

  await burnNFT(contractAddress, tokenId);
})(); -->
