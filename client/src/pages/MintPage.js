import React, { useEffect, useState } from 'react';
import './MintPage.css';
import Web3 from 'web3';
import tshirtImage from '../tshirt1.png'; 
import useContract from '../logic/contract-hook';


function MintPage() {
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);  // Define isMinted here
  const [imageUrl, setImageUrl] = useState();
  const {connected, connect, contract, accounts} = useContract();

  const handleMint = async () => {
    if (!connected) return;
    setIsMinting(true);
    const price = Web3.utils.toWei('0.001', 'ether');
    contract.methods.createCollectible().send({ from: accounts[0], value: price })
    .on('transactionHash', (hash) => {
      setTransactionStatus('Transaction in progress...')
    })
    .on('receipt', (receipt) => {
      console.log(receipt);
      const tokenId = receipt.events.NFTMinted.returnValues.tokenId;
      setImageUrl(`https://alteredbeasts.s3.us-east-2.amazonaws.com/nft_${tokenId}.png`)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      setIsMinting(false);
      setIsMinted(true);  // Update isMinted state here
      setTransactionStatus('Transaction confirmed!');
    })
    .on('error', (error) => {
      setIsMinting(false);
      setIsMinted(false);  // Update isMinted state here
      setTransactionStatus('An error occurred. Please try again.');
      console.error(error);
    });
  };

  useEffect(() => console.log('Outside', imageUrl), [imageUrl]);
  

  return (
    <div className="mint-container">
      <h2 className="main-heading">Mint Your NFT</h2>
      <div className="mint-item-container">
        <button className={`mint-button ${connected? '' : 'disabled'}`} onClick={handleMint} disabled={isMinting}>
          {isMinting ? 'Minting...' : 'Mint NFT'}
        </button>
        {!connected && <p onClick={connect}>Connect with Metamask</p>}  
      </div>
      {isMinting && <div className="loader"></div>}
      {transactionStatus && <p className="sub-heading">{transactionStatus}</p>}
      {isMinted && (
        <div className="minted-tshirt-container">
          <h3>Your Unique NFT-Shirt!</h3>
          <img src={tshirtImage} alt="Minted T-Shirt" className="minted-tshirt-image" />
          {/* <ImageLoader imageUrl={imageUrl} /> */}
        </div>
      )}
    </div>
  );
}

export default MintPage;


const ImageLoader = (props) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   console.log("ImageURL", props.imageUrl)
  //   if (props.imageUrl) {
  //     const checkImage = () => {
  //       fetch(props.imageUrl, { method: "HEAD" })
  //         .then((res) => {
  //           if (res.ok) {
  //             setImageSrc(props.imageUrl); // Image is ready, set the source
  //             setLoading(false);
  //           } else {
  //             throw new Error("Image not available yet");
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error.message);
  //           setTimeout(checkImage, 3000); // Retry after 5 seconds if not successful
  //         });
  //     };

  //     checkImage();
  //   }
  //   return () => setImageSrc(null); // Cleanup function to reset image source
  // }, [props.imageUrl]);

  function refresh() {
    console.log("Refreshing")
    setImageSrc(null);
    setTimeout(() => {
      setImageSrc(props.imageUrl);
    }, 3000);
  }

  // if (!props.imageUrl || loading) {
  //   return <></>;
  // } else {
    return <img onError={refresh} src={imageSrc} alt="Dynamic Content" />;
  // }
};
