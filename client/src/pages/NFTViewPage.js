import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import useContract from "../logic/contract-hook";

export function NFTViewPage() {
  const { id } = useParams();
  const { contract } = useContract();
  const [owner, setOwner] = useState();

  useEffect(() => {
    if (contract) {
      ownerOf(id);
    }
  }, [contract, id])

  const ownerOf = async (id) => {
    try {
      const owner = await contract.methods.ownerOf(id).call()
      setOwner(owner);
    } catch {
      setOwner('Nonexistant token')
    }
  };

  return <NFTView ownerAddress={owner} nftId={id} />
}


export function NFTView(props) {

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 62px)',
      padding: '20px',
      boxSizing: 'border-box'
    },
    image: {
      width: '100%',
      maxWidth: '300px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    infoContainer: {
      marginTop: '20px',
      textAlign: 'center',
      color: '#bbb'
    },
    id: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    address: {
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#ccc'
    }
  };

  return (
    <div style={styles.container}>
      <img src={`https://alteredbeasts.s3.us-east-2.amazonaws.com/nft_${props.nftId}.png`} alt="NFT" style={styles.image} />
      <div style={styles.infoContainer}>
        <div style={styles.id}>NFT ID: {props.nftId}</div>
        <p style={styles.address}> 
          Owner: {' '}
          <a 
            href={`https://etherscan.io/address/${props.ownerAddress}`} 
            target="_blank"
            rel="noreferrer"
          >{props.ownerAddress ? formatAddress(props.ownerAddress) : 'Loading...'}</a>
        </p>
      </div>
    </div>
  );
}


function formatAddress(addr) {
  return `asdf${addr.substring(0, 7)}...${addr.substring(addr.length - 6)}`
}