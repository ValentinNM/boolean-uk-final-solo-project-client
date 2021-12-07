import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  STOCKS_API, STOCKS_TOKEN, CALL_ME_SERVER} from "../utils/constants"

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [quantityToTrack, setQuantityToTrack] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${STOCKS_API}/stock/peers?symbol=AAPL&token=${STOCKS_TOKEN}`)
      .then((res) => res.json())
      .catch(console.error())
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
      quantity: parseFloat(quantityToTrack)
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
        window.alert(`Congrats 🎉 \n You just bought your ${asset.assetSymbol} stock `)
      })
      .catch(console.error());
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    setQuantityToTrack(quantity);
  };

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
                  <input
                    onChange={handleQuantityChange}
                    type="number"
                    min="0.5"
                    step="0.01"
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
