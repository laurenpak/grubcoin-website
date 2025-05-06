const Web3 = require('web3');
const contractABI = require('./path-to-your-ABI.json');
const contractAddress = '0xYourContractAddress';
const web3 = new Web3(window.ethereum); // or your local/Render network

async function main() {
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const baseURI = "https://gateway.pinata.cloud/ipfs/bafybeickx5pkhjgyd7ifqkgji3fuiixlrk4gdnqgznj4vof7rhvhholsq4/";

  await contract.methods.setBaseURI(baseURI).send({ from: accounts[0] });
  console.log('Base URI set!');
}

main();