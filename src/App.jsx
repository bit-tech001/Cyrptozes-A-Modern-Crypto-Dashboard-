import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Crypto from './pages/Crypto';

const App = () => {
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Crypto/:cryptoId' element={<Crypto/>} />
        {/* Optional: add a 404 route */}
        <Route path='*' element={<div className="text-center mt-10 text-red-500">Page Not Found</div>} />
        
      </Routes>
    </div>
  );
};


export default App;
