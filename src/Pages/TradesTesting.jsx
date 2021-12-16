import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { CALL_ME_SERVER, STOCKS_API, STOCKS_TOKEN } from "../utils/constants";

const columns = [
  { field: "assetSymbol", headerName: "Symbol", width: 150 },
  { field: "total", headerName: "Total Owned", width: 150 },
  { field: "price", headerName: "Price", width: 100 },
  {
    field: "quantity",
    headerName: "Shares",
    type: "number",
    width: 100,
  },
  {
    field: "date",
    headerName: "Acquisition date",
    description: "This column has a value getter and is not sortable.",
    width: 200,
  },
];

export default function DataTable() {
  const [allAssets, setAllAssets] = useState([]);

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

  const sortedAssets = allAssets.map((asset) => {
    const { date, price, quantity } = asset;

    const total = price * quantity;
    asset.total = total.toFixed(2);

    const stringifyDate = new Date(date).toLocaleString();
    asset.date = stringifyDate;

    return asset
  });

  return (
    <div style={{ height: 630, width: "100%" }}>
      <DataGrid
        rows={sortedAssets}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        // checkboxSelection
      />
    </div>
  );
}
