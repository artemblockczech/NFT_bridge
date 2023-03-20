// mintNFT.ts
import { ethers } from 'ethers';

// Provided ABI
const contractAbi = [/*... ABI content here ...*/];

// Connect to Ethereum using Infura
// Replace 'YOUR_INFURA_API_KEY' with your actual Infura API key
const provider = new ethers.providers.InfuraProvider('mainnet', 'YOUR_INFURA_API_KEY');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

async function mintNFT(contractAddress: string, to: string, uri: string) {
  try {
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    const mintTx = await contract.safeMint(to, uri);
    await mintTx.wait();
    console.log('NFT minted successfully');
  } catch (error) {
    console.error('Error minting NFT:', error);
  }
}

<!-- (async () => {
  const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
  const to = '0xRecipientAddress';
  const uri = 'ipfs://your_nft_metadata_uri_here';

  await mintNFT(contractAddress, to, uri);
})(); -->
