require("dotenv").config();const Web3 = require("web3");const request = require("request-promise");const fs = require("fs");const contract = require("../artifacts/contracts/ArGram.sol/ArGram.json");const provider = new Web3.providers.HttpProvider(POLYGON_MUMBAI_RPC_PROVIDER);const web3 = new Web3(provider);web3.eth.accounts.wallet.add(PRIVATE_KEY);const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);fs.readFile(req.file.path, async (err, buffer) => {    const image = buffer.toString("base64");
    const contentType = req.file.mimetype;    //Upload image file to IPFS
    const file = new Moralis.File("file", image, contentType);
    await file.saveIPFS({ useMasterKey: true });
    const fileIPFS = file.ipfs();    //Create JSON metadata
    const metadata = {
       name: "MyNFT",
       description: "MyNFT Description",
       image: fileIPFS,
    };    //Upload JSON metadata to IPFS
    const toBtoa = Buffer.from(JSON.stringify(metadata)).toString("base64");
    const json = new Moralis.File(`MyNFT-meta.json`, { base64: toBtoa });
    await json.saveIPFS({ useMasterKey: true });
    const tokenURI = json.ipfs();    //Mint NFT
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, “latest”);
    const transaction = {
        from: PUBLIC_KEY,
        to: CONTRACT_ADDRESS,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods
                     .mintNFT(PUBLIC_KEY, tokenURI)
                     .encodeABI(),
    };
    const signPromise = await web3.eth.accounts.signTransaction(
        transaction,
        PRIVATE_KEY
    );
    const signedTransaction = await web3.eth.sendSignedTransaction(
        signPromise[“rawTransaction”]
    );
    const hash = signedTransaction[“transactionHash”];
    console.log('The transaction hash is:', hash);
}
