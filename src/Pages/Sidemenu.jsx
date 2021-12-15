import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

export default function Sidemenu() {
  const navigate = useNavigate();

  const handleClick = (e, text) => {
    console.log({ text });
    navigate(text);
  };

  return (
    <div>
      <Box
        sx={{
          width: 250,
          height: "100vh",
          position: "fixed",
        }}
      >
        <List>
          {["dashboard", "portofolio", "trades", "account", "news"].map(
            (text, index) => (
              <ListItem
                variant="h2"
                button
                key={index}
                onClick={(e) => handleClick(e, text)}
              >
                <ListItemText primary={text} />
              </ListItem>
            )
          )}
        </List>
        <Divider />
      </Box>
    </div>
  );
}
