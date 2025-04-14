import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import CONTRACT_ABI from './abi.json';


// Polygon Mainnet details
const polygonDetails = {
  chainId: '0x89', // Hexadecimal chain ID for Polygon Mainnet
  chainName: 'Polygon Mainnet',
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/']
};

const amoyDetails = {
  chainId: '0x13882', // Hexadecimal chain ID for Polygon Mainnet
  chainName: 'POLYGON AMOY TESTNET',
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://www.oklink.com/amoy']
};

const sepoliaDetails = {
  chainId: '0xaa36a7', // Hexadecimal chain ID for Polygon Mainnet
  chainName: 'Sepolia test network',
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
}

const CONTRACT_ADDRESS = '0x665f04bBEbC70B688e2963F2D935acD4e7481CEF';

const useContract = () => {
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [web3, setWeb3] = useState();
  const options = useSDK();

  useEffect(() => {
    connect();
  }, 
  [options]
  );

  useEffect(() => {
    if (!options.sdk) return;
    const provider = options.sdk.getProvider();
    const web3Instance = new Web3(provider);
    setWeb3(web3Instance);
    const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setContract(contractInstance);
  }, [options.sdk])

  function connect() {
    options.sdk?.connect()
    .then(setAccounts)
  }

  return { accounts, connect, contract, web3, ...options };
}

export default useContract;