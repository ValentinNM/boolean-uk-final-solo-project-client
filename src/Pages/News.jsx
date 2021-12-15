import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { STOCKS_API, STOCKS_TOKEN } from "../utils/constants";

export default function News() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("forex");

  useEffect(() => {
    fetch(
      `${STOCKS_API}/news?category=${category}&minId=10&token=${STOCKS_TOKEN}`
    )
      .then((res) => res.json())
      .catch((error) => console.error({ error }))
      .then((data) => {

        setNews(data);
      });
  }, [category]);

  const handlePick = (event) => {
    const value = event.target.value;

    setCategory(value);
  };

  return (
    <>
    <div>
      <header className="sticky header">  {/* TODO -> FIX sticky header centering of items and height*/}
        <nav className="news-category-selection">
          <Button value="general" onClick={handlePick}>
            General{" "}
          </Button>
          <Button value="forex" onClick={handlePick}>
            Forex
          </Button>
          <Button value="crypto" onClick={handlePick}>
            Crypto
          </Button>
          <Button value="merger" onClick={handlePick}>
            Merger
          </Button>
        </nav>
      </header>
      <div className="center">
        {news.map((article, index) => {
          const { headline, image, summary, url } = article;

          return (
            <Card key={index} sx={{ maxWidth: 545 }}>
              <CardMedia
                component="img"
                height="140"
                image={image}
                alt="article"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {headline}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {summary}
                </Typography>
              </CardContent>
              <CardActions>
                <Button  color="secondary" size="small">
                  <a href={url}>See More</a>
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
      </div>
    </>
  );
}
