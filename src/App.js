import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./index.css";

import { useState } from "react";
import { Content, Sidebar, Footer, Header } from "./components/index";

/* import Profile from '../../profile/Profile';
 */

const App = () => {
  const [sideBar, setSideBar] = useState(true);

  function toggleSideBar() {
    if (sideBar == true) {
      setSideBar(false);
    } else {
      setSideBar(true);
    }
    console.log("clicked");
  }

  return (
    <BrowserRouter>
      <div className="">
        <Sidebar sideBar={sideBar} />
        <div className="d-flex flex-column min-vh-100">
          <Header openSideBar={toggleSideBar} />
          <div className={sideBar ? "content-sidebar " : "content"}>
            <Content />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
