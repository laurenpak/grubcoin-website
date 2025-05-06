import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/mint">Redeem Late Meal NFT</Link></li>
          <li><Link to="/order">Buy/Sell Late Meal NFT</Link></li>
        </ul>
      </nav>
      <div className='spacer' />
    </>
  );
}

export default NavigationBar;
