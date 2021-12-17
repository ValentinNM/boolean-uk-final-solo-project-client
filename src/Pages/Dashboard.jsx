import { useState, useEffect } from "react";
import {  STOCKS_API, STOCKS_TOKEN, CALL_ME_SERVER} from "../utils/constants"

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [quantityToTrack, setQuantityToTrack] = useState(null);

  useEffect(() => {
    fetch(`${STOCKS_API}/stock/peers?symbol=AAPL&token=${STOCKS_TOKEN}`)
      .then((res) => res.json())
      .catch(console.error)
      .then((symbols) => {
        const cleanSymbols = symbols.filter((symbol) => symbol !== "1337.HK");

        const symbolFetches = cleanSymbols.map((symbol) => {
          return fetch(
            `${STOCKS_API}/quote?symbol=${symbol}&token=${STOCKS_TOKEN}`
          )
            .then((res) => res.json())
            .then((prices) => ({ symbol, prices }));
        });

        Promise.all(symbolFetches).then((data) => {
          setStocks(data);
        });
      });
  }, []);

  const handleSubmit = (e, stock) => {
    e.preventDefault();

    const token = localStorage.getItem("token")

    const assetToBuy = {
      assetSymbol: stock.symbol,
      price: stock.prices.c,
      quantity: quantityToTrack,
      type: "BUY",
    };

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization" : token
      },
      body: JSON.stringify(assetToBuy),
    };

    fetch(`${CALL_ME_SERVER}/trades/buy`, fetchOptions)
      .then((res) => res.json())
      .catch(console.error())
      .then((data) => {
        const {asset} = data;
        window.alert(`Congrats 🎉 \n You just bought your ${asset.assetSymbol} stock `) // to be replaced with UI popup
      })
      .catch(console.error());
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setQuantityToTrack(quantity);
  };

  return (
    <div>
      <header className="header">
      <h1 >Dashboard</h1>
      </header>
      <div className="assets-container" >
        {stocks.map((stock, index) => {
          const { symbol, prices } = stock;
          return (
            <div key={index} className="asset-container">
              <h2>Asset symbol: {symbol} </h2>
              <p>Current price: ${prices.c}</p>
              <p>Open price: ${prices.o}</p>
              <p>Previous close price: ${prices.pc}</p>
              <p>Day high: ${prices.h}</p>
              <p>Day low: ${prices.l}</p>
              <hr />
              <div className="two-columns-grid">
                <label htmlFor="quantity">
                  <input
                    onChange={handleQuantityChange}
                    type="number"
                    min="1"
                    step="1"
                    name="quantity"
                    id="quantity"
                    style={{ maxWidth: 40 + "px" }}
                  />
                </label>
                <button type="submit" onClick={(e) => handleSubmit(e, stock)}>
                  BUY
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
