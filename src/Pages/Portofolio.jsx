import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import { CALL_ME_SERVER, STOCKS_API, STOCKS_TOKEN } from "../utils/constants";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "assetSymbol",
    numeric: false,
    disablePadding: true,
    label: "Assets Symbol",
  },
  {
    id: "averagePrice",
    numeric: true,
    disablePadding: false,
    label: "Average Price",
  },
  {
    id: "shares",
    numeric: true,
    disablePadding: false,
    label: "Shares",
  },
  {
    id: "curentPrice",
    numeric: true,
    disablePadding: false,
    label: "Current Price",
  },
  {
    id: "pnl",
    numeric: true,
    disablePadding: false,
    label: "Profits / Losses",
  },
  {
    id: "buySell",
    numeric: false,
    disablePadding: false,
    label: "Buy / Sell",
  },
];

function EnhancedTableHead(props) { // sorting the table
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="margin-ten">
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = { // prop types ? have no Ideea lol
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = () => {  // Portofolio Toolbar ?? maybe just remove it
  return (
    <Toolbar
    sx={{ pl: { sm: 2 },
    pr: { xs: 1, sm: 1 } }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h3"
        id="tableTitle"
        component="div"
      >
        Portofolio
      </Typography>
    </Toolbar>
  );
};

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  // const [revenue, setRevenue] = useState(0);
  const [amountInput, setAmountInput] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${CALL_ME_SERVER}/trades/aggregate`, {
      headers: {
        authorization: token,
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error({ error }))
      .then((assets) => {
        const symbols = assets.portofolio.map((asset) => {
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
          setPortfolio(data);
        });
      })
      .catch((error) => console.error({ error }));
  },[]);

  const handleTrackQuantity = (e) => {
    setAmountInput(e.target.value);
    console.log({ inside_handleTrackQuantity : e.target.value });
  };

  const handleSellQuantity = (e, asset) => {
    e.preventDefault();

    const { assetSymbol, currentPrices, quantity } = asset;

    const buttonName = e.target.name;

    if (amountInput > quantity) {
      window.alert("You can't sell more than you have");
    } else if (amountInput < 0) {
      window.alert("Number of shares cannot be negative");
    } else {
      const assetToSell = {
        assetSymbol,
        price: currentPrices.c,
        quantity:
          buttonName === "all" ? parseInt(quantity) : parseInt(amountInput),
        type: "SELL",
      };

      console.log({assetToSell});

      // TODO name for rutes: exchange/trade  rather than buy/sell

      fetch(`${CALL_ME_SERVER}/trades/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(assetToSell),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("SERVER POST SELL", data.asset);

          // TODO:  create a function to keep track of the overall balance
          // if (data.asset !== asset.quantity) {
          //   const performance =
          //     assetToSell.price * quantToSet - asset.price * quantToSet;
          //   const balanceUpdated = balance + performance;
          // }
          window.alert(
            "You have sold " + (buttonName === "all" ? quantity : amountInput) + " shares of " + assetSymbol
          );
        })
        .catch((error) => console.error({ error }));
    }
  };

  console.log({ portfolio });

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - portfolio.length) : 0;

  return (
    <Box className="table-container" sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* width of the actual form */}
        <EnhancedTableToolbar /> {/* // here  Maybe to remove?  */}
        <TableContainer>
          <Table
            sx={{ minWidth: 550 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={portfolio.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(portfolio, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asset, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  const { assetSymbol, price, quantity, currentPrices } = asset;

                  // const avgPrice = price
                  const avgPrice = price.toFixed(2);

                  const profit = (currentPrices.c * quantity - avgPrice * quantity).toFixed(2);
                  // REVENUE -> to solve the NaN error when price = 0
                  // setRevenue(revenue + profit);

                  return (
                    <TableRow
                      hover
                      key={index}
                      // tabIndex={-1}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="asset"
                        padding="none"
                      >
                        {assetSymbol}
                      </TableCell>
                      <TableCell align="right"> $ {avgPrice}</TableCell>
                      <TableCell align="right">{quantity}</TableCell>
                      <TableCell align="right">$ {currentPrices.c}</TableCell>
                      <TableCell align="right"> $ {profit}</TableCell>
                      <TableCell align="right">
                        <Stack
                          component="form"
                          sx={{ width: "10ch" }}
                          spacing={1}
                        >
                          <div className="two-columns-grid">
                            <input
                              className="quantity-input-field"
                              type="number"
                              min="0"
                              step="1"
                              onChange={handleTrackQuantity}
                            />
                            <Button size="small" variant="contained"
                             name="sell"
                             onClick={(e) => handleSellQuantity(e, asset)}
                            >
                              Sell
                            </Button>
                          </div>
                          <Button
                            className="sell-all-btn"
                            size="small"
                            variant="contained"
                            name="all"
                            onClick={(e) => handleSellQuantity(e, asset)}
                          >
                            Sell All
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow // Dense padding toggle functionality
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={portfolio.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
