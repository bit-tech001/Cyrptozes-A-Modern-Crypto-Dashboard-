import React, { useContext, useState } from 'react';
import { CryptoContext } from '../context/CryptoContext';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom'; // Corrected import

const CoinArea = () => {
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const { filteredCryptos, currentCurrency, setCurrentCurrency } = useContext(CryptoContext);

  const handleCurrencySelect = (selectedCurrency) => {
    switch (selectedCurrency) {
      case 'usd':
        setCurrentCurrency({ name: 'usd', Symbol: "$" });
        break;
      case 'eur':
        setCurrentCurrency({ name: 'eur', Symbol: "€" });
        break;
      case 'inr':
        setCurrentCurrency({ name: 'inr', Symbol: "₹" });
        break;
      default:
        setCurrentCurrency({ name: 'usd', Symbol: "$" });
    }
    setIsCurrencyDropdownOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900/95 to-gray-900/90 text-white px-4 sm:px-[5%] py-6 md:py-10 relative z-0'>
      <div className='text-center mb-8 md:mb-12 space-y-4 group relative z-10'>
        <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl opacity-30 animate-pulse-slow z-0' />
        <h1 className='text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-x leading-tight'>
          Cryptozes <br />
          <span className='block text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent'>
            Market Intelligence
          </span>
        </h1>
        <p className='text-gray-300/80 max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed mt-4'>
          Track real-time crypto market metrics with advanced and
          <br />
          <span className='bg-gradient-to-r from-emerald-400/80 to-cyan-400/80 bg-clip-text text-transparent mx-2'>
            neural network prediction
          </span>
        </p>
      </div>

      <div className='relative'>
        <div className='grid sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 text-sm py-4 px-4 mb-2 bg-gray-800/40 backdrop-blur-lg rounded-xl border border-emerald-500/20'>
          <p className='text-emerald-400/90'>Rank</p>
          <p className='text-cyan-400/90'>Coins</p>
          <div
            className='relative flex items-center gap-1 cursor-pointer group transform transition-transform duration-300 hover:scale-110 hover:shadow-xl'
            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
          >
            <span>Price</span>
            <div className='flex items-center gap-1'>
              <span className='text-emerald-400/90'>({currentCurrency.Symbol})</span>
              <ChevronDownIcon
                className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          <p className='text-center'>24H Flux</p>
          <p className='text-center'>Market Cap</p>
        </div>

        {/* Currency Dropdown */}
        {isCurrencyDropdownOpen && (
          <div className='absolute top-full mt-2 w-40 bg-gray-800/95 backdrop-blur-xl rounded-lg border border-emerald-500/20 shadow-2xl z-50'>
            {["usd", "eur", "inr"].map((code) => (
              <div
                key={code}
                className='px-4 py-3 hover:bg-emerald-600/30 transition-colors cursor-pointer flex items-center gap-2 transform hover:scale-105'
                onClick={() => handleCurrencySelect(code)}
              >
                <span className='text-emerald-400/80'>
                  {code === 'usd' ? "$" : code === "eur" ? "€" : "₹"}
                </span>
                <span className='text-gray-100'>{code.toUpperCase()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coin List */}
      <div className='space-y-3 relative z-10 mt-6'>
        {filteredCryptos.slice(0, 12).map((item) => (
          <Link
            to={`/Crypto/${item.id}`}
            key={item.id}
            className='block p-4 bg-gray-800/30 backdrop-blur-md hover:bg-gray-700/40 border border-emerald-500/10 hover:border-cyan-500/30 transition-all duration-300 group rounded-lg transform hover:scale-105 hover:shadow-2xl'
          >
            <div className='grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 items-center'>
              <span className='text-emerald-400/80 text-sm lg:text-base'>
                {item.market_cap_rank}
              </span>
              <div className='flex items-center gap-3'>
                <img src={item.image} alt={item.name} className='w-6 h-6' />
                <span className='text-white'>{item.name}</span>
              </div>
              <span>{currentCurrency.Symbol}{item.current_price}</span>
              <span className={`${item.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.price_change_percentage_24h?.toFixed(2)}%
              </span>
              <span>{currentCurrency.Symbol}{item.market_cap.toLocaleString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoinArea;
