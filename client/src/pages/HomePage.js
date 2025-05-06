import "./HomePage.css";
import useContract from "../logic/contract-hook";

function HomePage() {
  const { connected, accounts } = useContract();

  return (
    <div className="home-container">
        <div>
          <h1 className="main-heading">{'GrubCoin'}</h1>
          <h2 className="sub-heading">Decentralized Marketplace for <br></br>Redeeming and Trading Late Meal NFT</h2>
        </div>
        <div className="grid-container">
          <img class="logo" src="/weblogo.png" alt="logo"/>
        </div>

        {/* metamask sign-in confirmation */}
        {connected && accounts?.length > 0 &&
          <div className="signed-in">
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png' alt="metamask" />
            <p>Signed in with MetaMask: {accounts[0]?.substring(0, 4)}...{accounts[0]?.substring(accounts[0].length - 4)}</p>
          </div>
        }
      </div>
  );
}

export default HomePage;
