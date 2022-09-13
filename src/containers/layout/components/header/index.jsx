import React, { useEffect, useState } from "react";
import config from "@config";
import "./style/header.scss";
import axios from "axios";

import { Link } from "react-router-dom";

import { io } from "socket.io-client";

const socket = io(config.server.host);

const Header = () => {
  const [lightClass, setLightClass] = useState("");
  const [configP, setConfigP] = useState({});
  const [load, setLoad] = useState(false);

  const startTimer = (date, lightConfig, dateCondition) => {
    if (!dateCondition) {
      adaptedDateText = "artificial light";
      setLightClass("lightTime");
    } else {
      adaptedDateText = "night";
      setLightClass("nightTime");
    }
  };

  useEffect(() => {
    socket.on("actuators/artificialLight", (data) => {
      if (data) setLightClass("lightTime");
      else setLightClass("nightTime");
    });

    axios.get(`${config.server.host}/config`).then((data) => {
      setConfigP(data.data.body);
      setLoad(true);
    });
  }, []);

  return (
    <header>
      <div className="header-container">
        <h1>R G R E E N</h1>
        <nav className="header-navBar">
          <Link to="/">Live</Link>
          <Link to="/history">History</Link>
        </nav>
      </div>
      <div className={`header-light ${lightClass}`}>
        <h2 className="header-light__time">{load && "----"}</h2>
        <h1 className="header-light__plantName">
          {load && configP.PLANT.name}
        </h1>
      </div>
    </header>
  );
};

export default Header;
