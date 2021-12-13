import { Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard"
import NotFound from "../Pages/NotFound";
import Trades from "../Pages/Trades";
import News from "../Pages/News";
import Portofolio from "../Pages/Portofolio";
import Sidemenu from "../Pages/Sidemenu";

export default function Home( props) {

    const {authUser} = props;

  return (
    <>
      <div className="app_main_container">
        <Sidemenu/>
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard authUser={authUser} />}
          />
          <Route
            path="/portofolio"
            element={<Portofolio authUser={authUser} />}
          />
          <Route path="/trades" element={<Trades />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
