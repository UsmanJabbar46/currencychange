import React, { useEffect, useState } from 'react';
import './App.css';

import CurrencyInput from './Components/CurrencyInput';

const BASE_URL = 'https://v6.exchangerate-api.com/v6/0d8b749edad74aab8ad72f0d/latest/USD';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [error, setError] = useState(null);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.conversion_rates)[112];
        const rates = Object.keys(data.conversion_rates);
        setCurrencyOptions(rates);
        setFromCurrency(data.base_code);
        setToCurrency(firstCurrency);
        setExchangeRate(data.conversion_rates[firstCurrency]);
      })
      .catch((error) => {
        console.error('Error fetching currency rates:', error);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result === 'error') {
            throw new Error('Error fetching exchange rate');
          } else {
            setExchangeRate(data.conversion_rates[toCurrency]);
            setError(null);
          }
        })
        .catch((error) => {
          console.error('Error fetching exchange rate:', error);
          setError('Error fetching exchange rate');
        });
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    const inputAmount = e.target.value;
    try {
      const parsedAmount = parseFloat(inputAmount);
      if (!isNaN(parsedAmount) || inputAmount === '') {
        setAmount(parsedAmount);
        setAmountInFromCurrency(true);
        setError(null);
      } else {
        setError('Please enter a valid number');
      }
    } catch (error) {
      setError('Please enter a valid number');
    }
  }
  
  function handleToAmountChange(e) {
    const inputAmount = e.target.value;
    try {
      const parsedAmount = parseFloat(inputAmount);
      if (!isNaN(parsedAmount) || inputAmount === '') {
        setAmount(parsedAmount);
        setAmountInFromCurrency(false);
        setError(null);
      } else {
        setError('Please enter a valid number');
      }
    } catch (error) {
      setError('Please enter a valid number');
    }
  }
  
  

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-brand">Converter</div>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      <div className="converter">
        <h2> WELCOME TO EXCHNAGE MASTER</h2>

        <div className="input-group">
          <CurrencyInput
            currencyOptions={currencyOptions}
            selectedCurrency={fromCurrency}
            onChangeCurrency={(e) => setFromCurrency(e.target.value)}
            onChangeAmount={handleFromAmountChange}
            amount={fromAmount}
          />
        </div>

        <div className="equal">=</div>
        <div className="input-group">
          <CurrencyInput
            currencyOptions={currencyOptions}
            selectedCurrency={toCurrency}
            onChangeCurrency={(e) => setToCurrency(e.target.value)}
            onChangeAmount={handleToAmountChange}
            amount={toAmount}
          />
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;





 