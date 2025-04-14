import React, { useState } from 'react';
import './OrderPage.css'; // Ensure the CSS is correctly linked
import NFTGrid from '../components/NFTGrid';

function OrderPage() {
  const [nftId, setNftId] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    size: '',
    address: '',
  });

  const handleInputChange = (event) => {
    setOrderDetails({
      ...orderDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmitOrder = () => {
    console.log(`Ordering NFT ID: ${nftId} with details:`, orderDetails);
  };

  return (
    <div className="order-container">
      <h1 className="main-heading">Order Your NFT T-Shirt</h1>
      <form className="order-form">
        <input 
          type="text" 
          value={nftId} 
          onChange={(e) => setNftId(e.target.value)}
          placeholder="Enter your NFT ID"
        />
        <input 
          type="text" 
          name="size" 
          value={orderDetails.size} 
          onChange={handleInputChange}
          placeholder="T-Shirt Size"
        />
        <input 
          type="text" 
          name="address" 
          value={orderDetails.address} 
          onChange={handleInputChange}
          placeholder="Delivery Address"
        />
        <button onClick={handleSubmitOrder}>Submit Order</button>
      </form>
      <NFTGrid />
    </div>
  );
}

export default OrderPage;
