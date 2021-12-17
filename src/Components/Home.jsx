import { Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import NotFound from "../Pages/NotFound";
import Trades from "../Pages/Trades";
// import TradesTesting from "../Pages/TradesTesting";
import News from "../Pages/News";
import Portofolio from "../Pages/Portofolio";
import Sidemenu from "../Pages/Sidemenu";
import Account from "../Pages/AccountSettings";
import EditProfile from "../Pages/EditProfile";

export default function Home(props) {
  const { authUser, setAuthUser } = props;
  // console.log({authUser})

  return (
    <>
      {authUser && (
        <div className="app_main_container">
          <Sidemenu setAuthUser={setAuthUser} />
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/portofolio"
              element={<Portofolio />}
            />
            <Route path="/trades" element={<Trades />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            {/* <Route path="/trades" element={<TradesTesting />} /> */}
            <Route path="/news" element={<News />} />
            <Route path="*" element={<NotFound />} />{" "}
            {/* TODO -> to redirect to NotFound within App.js; so page will be full full browser view*/}
          </Routes>
        </div>
      )}
    </>
  );
}
