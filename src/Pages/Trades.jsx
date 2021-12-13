import { useState, useEffect } from "react";
import { CALL_ME_SERVER, STOCKS_API, STOCKS_TOKEN } from "../utils/constants";

export default function Trades() {
  const [allAssets, setAllAssets] = useState([]);
  const [balance, setBalance] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${CALL_ME_SERVER}/trades/all`, {
      headers: {
        authorization: token,
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error({ error }))
      .then((assets) => {
        const symbols = assets.userAssets.map((asset) => {
          const { assetSymbol } = asset;

          return fetch(
            `${STOCKS_API}/quote?symbol=${assetSymbol}&token=${STOCKS_TOKEN}`
          )
            .then((res) => res.json())
            .then((quotes) => {
              return { ...asset, currentPrices: quotes }; // return is for the fetch
            });
        });

        Promise.all(symbols).then((data) => {
          setAllAssets(data);
        });
      })
      .catch((error) => console.error({ error }));
  }, []);

  return (
    <div>
      <h1>Here's a breakdown of you trades history</h1>
      <div>
        <h3> Balance: </h3>
        <p>
          {" "}
          <strong>$</strong> {balance}
        </p>
      </div>
      <hr />
      <ul>
        <p>Your Assets</p>

        {allAssets.map((asset, index) => {
          const { assetSymbol, date, price, quantity, currentPrices } = asset;

          let total = price * quantity;

          // const performance = currentPrices.c * quantity - total;

          let stringifyDate = new Date(date).toLocaleString();

          return (
            <li key={index}>
              <hr />
              <p>
                <strong> Stock: </strong> {assetSymbol}
              </p>
              <p>Total owned: $ {total.toFixed(2)} </p>
              <p>Acquiring price: $ {price}</p>
              <p>Shares # {quantity}</p>
              <p>Acquisition date: {stringifyDate}</p>
              <p>Current Price: $ {currentPrices.c} </p>
              <p>Open price: $ {currentPrices.o}</p>
              <p>previous close price: $ {currentPrices.pc} </p>
              <p>day high: $ {currentPrices.h} </p>
              <p>day low: $ {currentPrices.l}</p>
            </li>
          );
        })}
      </ul>
      <div className="assets-filter" >
        <h3>Filter by:</h3>
      </div>
    </div>
  );
}
