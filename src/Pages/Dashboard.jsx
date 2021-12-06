import { useState, useEffect } from "react";

export default function Dashboard() {

  const [stocks, setStocks] = useState([]);

  const STOCKS_API = process.env.REACT_APP_FINNHUB_API;
  const STOCKS_TOKEN = process.env.REACT_APP_FINN_TOKEN;

  useEffect(() => {
    fetch(`${STOCKS_API}/stock/peers?symbol=AAPL&token=${STOCKS_TOKEN}`)
      .then((res) => res.json())
      .catch(console.error())
      .then((symbols) => {
        
        const cleanSymbols = symbols.filter( symbol => symbol !== '1337.HK');

        console.log({cleanSymbols});

        const symbolFetches = cleanSymbols.map((symbol) => {
            return fetch(`${STOCKS_API}/quote?symbol=${symbol}&token=${STOCKS_TOKEN}`).then((res) => res.json()).then( prices => ({symbol, prices}))
            }) 

    Promise.all(symbolFetches).then(data => {
        console.log({data});
        setStocks(data);
      })
    })

  }, []);

  console.log({stocks});

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {stocks.map((stock, index) => {
          const { symbol, prices } = stock;
          return (
            <div key={index}>
              <h2> Stock: {symbol} </h2>
              <p>current price: ${prices.c}</p>
              <p>open price: ${prices.o}</p>
              <p>previous close price: ${prices.pc}</p>
              <p>day high: ${prices.h}</p>
              <p>day low: ${prices.l}</p>
              <div className="stocks-options">
                <label htmlFor="quantity">
                  <input type="number" min="0.5" step="0.01" name="quantity" id="quantity" style={{maxWidth : 35 + "px"}} />
                </label>
                <button>BUY</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
