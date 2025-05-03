import { createContext, useEffect, useState } from "react";

// Create the context
export const CryptoContext = createContext();

// Context provider component
const CryptoContextProvider = (props) => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCurrency, setCurrentCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  // API Key (replace with secure storage in production)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCryptoData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-mjPbJmXittvwcfk1yQYx8kn7",
      },
    };

    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency.name}`,
        options
      );

      const data = await res.json();
      setCryptoList(data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  // Fetch data when currency changes
  useEffect(() => {
    fetchCryptoData();
  }, [currentCurrency, fetchCryptoData]);

  // Filter cryptos when list or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCryptos(cryptoList);
    } else {
      setFilteredCryptos(
        cryptoList.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [cryptoList, searchTerm]);

  // Provide values via context
  const contextValue = {
    cryptoList,
    filteredCryptos,
    currentCurrency,
    setCurrentCurrency,
    searchTerm,
    setSearchTerm,
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {props.children}
    </CryptoContext.Provider>
  );
};

export default CryptoContextProvider;
