import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MintPage from './pages/MintPage';
import OrderPage from './pages/OrderPage';
import NavigationBar from './components/NavigationBar';
import { NFTViewPage } from './pages/NFTViewPage';
import UncontrolledExample from './pages/test';
import 'bootstrap/dist/css/bootstrap.min.css';



function App(props) {
  return (
    <Router>
      <NavigationBar />
      {/* Comment out Routes to test NavigationBar alone */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mint" element={<MintPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/:id" element={<NFTViewPage />} />
        <Route path="/test" element={<UncontrolledExample />} />
      </Routes>
    </Router>
  );
}

export default App;
