import React, { useEffect, useState, useRef } from 'react';
import './MintPage.css';
import Web3 from 'web3';
import tokenImage from '../token.png'; 
import useContract from '../logic/contract-hook';


function MintPage() {
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);  // Define isMinted here
  const [imageUrl, setImageUrl] = useState();
  const {connected, connect, contract, accounts} = useContract();

  // FOR RANDOMLY GENERATING OUT OF 20 MEAL IMAGE OPTIONS...
  // create a pool of available token IDs
  const TOTAL_IMAGES = 24;
  const getShuffledTokens = () => {
    const tokens = Array.from({ length: TOTAL_IMAGES }, (_, i) => i);
    return tokens.sort(() => Math.random() - 0.5); // basic shuffle
  }; 

  // Keep track of which ones are used — use useRef or useState
  const tokenQueueRef = useRef(getShuffledTokens());

  // pull a random token from the shuffled queue
  const getNextTokenId = () => {
    if (tokenQueueRef.current.length === 0) {
      tokenQueueRef.current = getShuffledTokens(); // reset when all used
    }
    return tokenQueueRef.current.pop();
  };

  const handleMint = async () => {
    if (!connected) return;
  
    setIsMinting(true);
    // when the user hits the “Mint NFT” button.
    const price = Web3.utils.toWei('0.001', 'ether');
    const tokenId = getNextTokenId(); // get your unique image token ID
  
    // send the contract
    contract.methods.createCollectible().send({ from: accounts[0], value: price })
      .on('transactionHash', (hash) => {
        setTransactionStatus('Transaction in progress...');
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
        // // with your dynamic token id, build your image URL
        setImageUrl(`https://gateway.pinata.cloud/ipfs/bafybeicy3zkk2bk542hudstasmd7wmnlrvqrm5mzjx7lef6i7ytrvdrh3y/nft_${tokenId}.png`);
      })
      .on('confirmation', () => {
        setIsMinting(false);
        setIsMinted(true);
        setTransactionStatus('Transaction confirmed!');
      })
      .on('error', (error) => {
        setIsMinting(false);
        setIsMinted(false);
        setTransactionStatus('An error occurred. Please try again.');
        console.error(error);
      });
  };

  useEffect(() => console.log('Outside', imageUrl), [imageUrl]);
  
  return (
    <div className="mint-container">
      <h2 className="main-heading2">Redeem Your Late Meal NFT</h2>
      <div className="mint-item-container">
        <button className={`mint-button ${connected? '' : 'disabled'}`} onClick={handleMint} disabled={isMinting}>
          {isMinting ? 'Minting...' : 'Mint NFT'}
        </button>
        {!connected && <p onClick={connect}>Connect with Metamask</p>}
      </div>
      {isMinting && <div className="loader"></div>}
      {transactionStatus && <p className="sub-heading2">{transactionStatus}</p>}
      {isMinted && (
        <div className="minted-token-preview">
          <h3 className="token-title">Your Unique Late Meal NFT Token!</h3>
          <div className="token-image-wrapper">
            <img src={tokenImage} alt="Base Token" className="base-token" />
            <img src={imageUrl} alt="Overlay" className="overlay-token" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MintPage;

const ImageLoader = ({ imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!imageUrl) return;
    
    const checkImage = () => {
      fetch(imageUrl, { method: "HEAD" })
        .then((res) => {
          if (res.ok) {
            setImageSrc(imageUrl);
          } else {
            throw new Error("Image not ready");
          }
        })
        .catch(() => {
          setTimeout(checkImage, 3000); // retry every 3s
        });
    };

    checkImage();
    return () => setImageSrc(null);
  }, [imageUrl]);

  if (!imageSrc) return null;
  return <img className="overlay-image" src={imageSrc} alt="Dynamic NFT" />;
};