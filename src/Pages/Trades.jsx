import { useState, useEffect } from "react";
import { CALL_ME_SERVER } from "../utils/constants";

export default function Trades() {
  const [allAssets, setAllAssets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [symbols, setSymbols] = useState([]);
  const [filterBySymbol, setFilterBySymbol] = useState([]);
  const [filterByDate, setFilterByDate] = useState(null);

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
        setAllAssets(assets.userAssets);
        setSymbols(assets.userAssets.map((asset) => asset.assetSymbol)); // directly from the userAssets obj extract the assetSymbol only
      })
      .catch((error) => console.error({ error }));
  }, []);

  const handleSort = (e, symbol) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;

    if (type === "checkbox") {
      if (checked) {
        // handle checked

        const filtered = allAssets.filter(
          (asset) => asset.assetSymbol === symbol
        ); // add one

        setFilterBySymbol(
          filterBySymbol.concat(filtered.map((asset) => asset.assetSymbol))
        ); // concat || add next obj to array
      } else {
        // handle unchecked

        setFilterBySymbol(
          filterBySymbol.filter((assetSymbol) => assetSymbol !== symbol)
        );
      }
    } else if (name === "date") {

      const dateInput = new Date(value).toISOString();

      if (name === "select" && value === "asc") {
        setFilterByDate(dateInput);
        // setFilterByDate(allAssets.filter((asset) => asset.date === dateInput));
        console.log({ value, dateInput, filterByDate });
      } else if(name === "select" && value === "desc") {
        let filtered = allAssets.filter((asset) => asset.date < dateInput);
        // setFilterByDate(filtered);
        setFilterByDate(dateInput);
        console.log({ value , dateInput});
      }
    }
  };

  let filterdAssets = allAssets;

  if (filterBySymbol.length > 0) {
    filterdAssets = filterdAssets.filter((asset) =>
      filterBySymbol.includes(asset.assetSymbol)
    );
  } else if (filterByDate) {
    // filterdAssets = filterdAssets.filter(asset => asset.date > filterByDate.date)
    filterdAssets = filterByDate
      //  > filterByDate);
  }

  return (
    <div>
      <header className="header">
        <h1>Here's a breakdown of your trades history</h1>
      </header>
      <section className="two-column-trades">
        <main>
          <table className="table-grid">
            <colgroup span="5"></colgroup>
            <tr className="table-columns">
              <th>Symbol</th>
              <th>Type</th>
              <th>Acquiring Price</th>
              <th> Shares</th>
              <th>Acquisition Date</th>
              <th>Total</th>
            </tr>

            {filterdAssets.map((asset, index) => {
              const { assetSymbol, date, price, quantity } = asset;

              let total = (price * quantity).toFixed(2);

              let stringifyDate = new Date(date).toLocaleString();

              return (
                <tr className="table-columns" key={index}>
                  <th className="table-cell"> {assetSymbol} </th>
                  <th className="table-cell"> {asset.type} </th>
                  <th className="table-cell"> $ {price} </th>
                  <th className="table-cell"> {quantity} </th>
                  <th className="table-cell"> {stringifyDate} </th>
                  <th className="table-cell"> $ {total} </th>
                </tr>
              );
            })}
          </table>
        </main>
        <aside className="trades-aside">
          <div>
            <h3> Balance: </h3>
            {/* TODO -> display balance in raport with the Accound model */}
            <p>
              <strong>$</strong> {balance}
            </p>
            <div>
              <input type="date" name="date" onChange={handleSort} />
              <select name="select" onChange={handleSort}>
                <option value=""> Please select ...</option>
                <option value="asc" name="asc">
                  Ascending
                </option>
                <option value="desc" name="desc" onSelect={handleSort}>
                  Descending
                </option>
              </select>
            </div>
          </div>
          <div className="assets-filter">
            <h3>Filter by:</h3>
            {symbols.map((symbol, index) => {
              // TODO - display unique symbol
              return (
                <div key={index} className="symbol-filter">
                  <input
                    type="checkbox"
                    name={symbol}
                    value={symbol}
                    onClick={(e) => handleSort(e, symbol)}
                  />
                  <label htmlFor=""> {symbol} </label>
                </div>
              );
            })}
            <button type="button" name="clear" className="clear-all">
              Clear All
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
