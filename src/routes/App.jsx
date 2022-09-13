import React from "react";
import Live from "../pages/live";
import History from "../pages/history";
import Layout from "../containers/layout";

import "../style/app.scss";

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Live/>}/>
          <Route path="/history" element={<History/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
