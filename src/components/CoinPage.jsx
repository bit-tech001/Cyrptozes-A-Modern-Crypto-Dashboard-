import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoContext } from '../context/CryptoContext';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { FaRegLightbulb, FaMoon } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

const CoinPage = () => {
  const { cryptoId } = useParams();
  const [coinDetails, setCoinDetails] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [period, setPeriod] = useState('7');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [livePrice, setLivePrice] = useState(null);

  const { currentCurrency } = useContext(CryptoContext);

  const requestOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-mjPbJmXittvwcfk1yQYx8kn7',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        const detailsRes = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}`, requestOptions);
        if (!detailsRes.ok) throw new Error(`Coin details error: ${detailsRes.statusText}`);
        const details = await detailsRes.json();
        setCoinDetails(details);

        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currentCurrency.name}&days=${period}`,
          requestOptions
        );
        if (!chartRes.ok) throw new Error(`Chart data error: ${chartRes.statusText}`);
        const chart = await chartRes.json();
        setChartData(chart);

        const historyRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currentCurrency.name}&days=30`,
          requestOptions
        );
        if (!historyRes.ok) throw new Error(`Price history error: ${historyRes.statusText}`);
        const history = await historyRes.json();
        setPriceHistory(history.prices);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      const fetchLivePrice = async () => {
        try {
          const liveRes = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${currentCurrency.name.toLowerCase()}`,
            requestOptions
          );
          if (!liveRes.ok) throw new Error('Live price error');
          const liveData = await liveRes.json();
          setLivePrice(liveData[cryptoId]?.[currentCurrency.name.toLowerCase()]);
        } catch (err) {
          console.error('Error fetching live price:', err);
        }
      };
      fetchLivePrice();
    }, 10000);

    return () => clearInterval(interval);
  }, [cryptoId, period, currentCurrency]);

  const times = chartData?.prices.map(p => new Date(p[0]).toLocaleString());
  const prices = chartData?.prices.map(p => p[1]);
  const volumes = chartData?.total_volumes.map(v => v[1]);
  const marketCaps = chartData?.market_caps.map(m => m[1]);

  const handlePeriodChange = (e) => setPeriod(e.target.value);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const calculateStatistics = () => {
    if (!chartData) return { highest: 0, lowest: 0, average: 0 };
    const pricesList = chartData?.prices.map(p => p[1]);
    const highest = Math.max(...pricesList);
    const lowest = Math.min(...pricesList);
    const average = pricesList.reduce((acc, curr) => acc + curr, 0) / pricesList.length;
    return { highest, lowest, average };
  };

  const { highest, lowest, average } = calculateStatistics();

  if (!cryptoId) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p>No cryptocurrency ID provided.</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p>{error}</p></div>;
  if (loading || !coinDetails || !chartData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton height={30} width="80%" />
          <Skeleton height={30} width="60%" />
          <Skeleton height={200} />
          <Skeleton height={40} />
          <Skeleton count={3} height={50} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 sm:px-6 md:px-10 py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{coinDetails.name} ({coinDetails.symbol.toUpperCase()})</h1>
        <button onClick={toggleDarkMode} className="text-xl">
          {darkMode ? <FaRegLightbulb /> : <FaMoon />}
        </button>
      </div>

      <motion.div className="flex flex-col md:flex-row gap-6 items-center bg-gray-800/30 p-6 rounded-xl border border-emerald-400/20 shadow-xl"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <img src={coinDetails.image?.large} alt={coinDetails.name} className="w-20 h-20 rounded-full bg-emerald-400/20 p-2" />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold">{coinDetails.name} ({coinDetails.symbol.toUpperCase()})</h2>
          <p className="text-sm text-gray-300">Rank: #{coinDetails.market_cap_rank}</p>
          <p className="text-lg text-emerald-400 font-semibold mt-2">
            {currentCurrency.symbol} {livePrice !== null ? livePrice.toFixed(2) : "Loading..."}
          </p>
          <p className={`text-sm ${coinDetails.market_data.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            24h Change: {coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-gray-800/40 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Market Cap</p>
          <p className="text-xl font-semibold">
            {currentCurrency.symbol} {coinDetails.market_data.market_cap[currentCurrency.name.toLowerCase()].toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Total Volume</p>
          <p className="text-xl font-semibold">
            {currentCurrency.symbol} {coinDetails.market_data.total_volume[currentCurrency.name.toLowerCase()].toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Circulating Supply</p>
          <p className="text-xl font-semibold">{coinDetails.market_data.circulating_supply.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-gray-800/40 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Highest Value</p>
          <p className="text-xl font-semibold">{currentCurrency.symbol} {highest.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Lowest Value</p>
          <p className="text-xl font-semibold">{currentCurrency.symbol} {lowest.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/40 p-4 rounded-xl">
          <p className="text-sm text-gray-400">Average Price</p>
          <p className="text-xl font-semibold">{currentCurrency.symbol} {average.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-end mt-6">
        <label htmlFor="period" className="mr-2 text-sm text-gray-400">View period:</label>
        <select
          id="period"
          className="bg-gray-700 text-white p-2 rounded-md"
          value={period}
          onChange={handlePeriodChange}
        >
          <option value="1">1 Day</option>
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="90">90 Days</option>
        </select>
      </div>

      <div className="mt-8">
        <Plot
          data={[
            {
              x: times,
              y: prices,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Price',
              marker: { color: 'rgb(51, 153, 255)' },
            },
            {
              x: times,
              y: volumes,
              type: 'scatter',
              mode: 'lines',
              name: 'Volume',
              yaxis: 'y2',
              marker: { color: 'rgba(255, 99, 132, 0.6)' },
            },
            {
              x: times,
              y: marketCaps,
              type: 'scatter',
              mode: 'lines',
              name: 'Market Cap',
              yaxis: 'y3',
              marker: { color: 'rgba(255, 206, 86, 0.6)' },
            },
          ]}
          layout={{
            title: 'Price, Volume, and Market Cap Over Time',
            paper_bgcolor: darkMode ? '#1a202c' : '#fff',
            plot_bgcolor: darkMode ? '#1a202c' : '#fff',
            font: { color: darkMode ? '#fff' : '#000' },
            xaxis: { title: 'Date & Time' },
            yaxis: { title: 'Price', side: 'left' },
            yaxis2: {
              title: 'Volume',
              overlaying: 'y',
              side: 'right'
            },
            yaxis3: {
              title: 'Market Cap',
              anchor: 'free',
              overlaying: 'y',
              side: 'right',
              position: 1.05,
            },
          }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default CoinPage;
