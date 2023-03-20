// src/App.js
import { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

function App() {
  const [tokenId, setTokenId] = useState('');
  const [provider, setProvider] = useState(null);
  const [contractAddress, setContractAddress] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!provider || !contractAddress) return;

    const signer = provider.getSigner();
    const bridgeWalletAddress = '0x...'; // Fixed bridge wallet address
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    try {
      const tx = await contract.transferFrom(await signer.getAddress(), bridgeWalletAddress, tokenId);
      await tx.wait();
      alert('NFT transferred successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error transferring NFT');
    }
  };

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: 'YOUR_INFURA_API_KEY',
          },
        },
      },
    });

    const modalProvider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(modalProvider);
    setProvider(web3Provider);
  };

  return (
    <Container>
      <h1>NFT Bridge</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <Button type="submit">Transfer NFT</Button>
      </Form>
      {!provider && (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </Container>
  );
}

export default App;
