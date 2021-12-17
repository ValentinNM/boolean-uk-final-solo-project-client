import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Sidemenu({setAuthUser}) {
  const navigate = useNavigate();

  const handleClick = (e, text) => {

    navigate(text);
  };

  const handleLogout = (e) => { 
  
    localStorage.clear("token")

    setAuthUser(null)

      navigate("/login")
  }
    

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
        <Button onClick={handleLogout} >Log out</Button>
      </Box>
    </div>
  );
}
