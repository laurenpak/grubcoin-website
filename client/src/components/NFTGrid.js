import React, { useEffect, useState } from 'react';
import useContract from '../logic/contract-hook';

function NFTGrid() {
  const {contract, accounts} = useContract();
  const [nftData, setNftData] = useState([]);

  useEffect(() => {
    if (contract)
      getMyNFTs();
  }, [contract, accounts])

  async function fetchNFTImage(tokenId) {
    const uri = await contract.methods.tokenURI(tokenId).call();
    const metadata = await fetch(uri).then(res => res.json());
    return metadata.image;
  }

  async function getMyNFTs() {
    if (!accounts || accounts?.length <= 0) return;
    let response;
    try {
      response = await contract.methods.getMyNFTs().call({ from: accounts[0] });
    } catch (e) {
      console.error(e);
    }
    
    const items = response[0].map((tokenId, index) => ({
      tokenId,
      imageUrl: `https://alteredbeasts.s3.us-east-2.amazonaws.com/nft_${tokenId}.png`,
      owner: accounts[0]
    }));
    setNftData(items);
  }

  const styles = {
    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: 'rgba(230, 218, 212, 0.55)'
    },
    card: {
      width: '300px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#323',
      padding: '10px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    image: {
      color: 'white',
      width: '100%',
      height: 'auto',
      borderRadius: '5px'
    },
    info: {
      marginTop: '10px',
      fontSize: '10px',
      color: 'white',
    },
    buttonContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '10px'
    },
    button: {
      padding: '10px 20px',
      fontSize: '.8rem',
      border: 'none',
      borderRadius: '5px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '7rem',
      background: 'linear-gradient(to right, #db7c1d 0%, rgb(189, 97, 12) 100%)'
    }
  };

  return (
    <div style={styles.grid}>
      {nftData.map((nft) => (
        <div key={nft.id} style={styles.card}>
          <img src={nft.imageUrl} alt={`NFT ${nft.tokenId}`} style={styles.image} />
          <div style={styles.info}>
            <div>{`ID: ${nft.tokenId}`}</div>
            <div>Owner: {nft.owner}</div>
          </div>
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={() => console.log(`Order Late Meal for NFT ID: ${nft.id}`)}>Purchase Late Meal</button>
            <button style={styles.button} onClick={() => console.log(`Send NFT ID: ${nft.id}`)}>Remove Listing</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NFTGrid;
