import React, { useEffect, useState } from "react";
import config from "@config";
import "./style/header.scss";
import axios from "axios";

import { Link } from "react-router-dom";

import { io } from "socket.io-client";
import moment from "moment";

const socket = io(config.server.host);

const Header = () => {
  const [lightClass, setLightClass] = useState("");
  const [configPlant, setConfigPlant] = useState({});
  const [load, setLoad] = useState(false);
  const [startedCounter, setStartedCounter] = useState(false);
  const [counter, setCounter] = useState({
    hours: "",
    minutes: "",
    seconds: "",
    text: "",
  });

  const getLight = async (callback) => {
    await axios.get(`${config.server.host}/light`).then((data) => {
      callback(data.data.body);
    });
  };

  const startCounter = () => {
    if (!startedCounter) {
      setInterval(() => {
        setCounter((lastSetCounter) => {
          if (lastSetCounter.seconds === 0) {
            if (lastSetCounter.minutes === 0) {
              return {
                ...lastSetCounter,
                seconds: 59,
                minutes: 59,
                hours: lastSetCounter.hours - 1,
              };
            } else {
              return {
                ...lastSetCounter,
                seconds: 59,
                minutes: lastSetCounter.minutes - 1,
              };
            }
          } else {
            return { ...lastSetCounter, seconds: lastSetCounter.seconds - 1 };
          }
        });
      }, 1000);
    }
  };

  const configCounter = (time, text) => {
    setCounter({
      hours: time.hours(),
      minutes: time.minutes(),
      seconds: time.seconds(),
      text,
    });

    setLoad(true);

    if (!startedCounter) {
      startCounter();
      setStartedCounter(true);
    }
  };

  const timeEncoder = (time) => {
    if (time < 10) return "0" + time;
    else return time;
  };

  useEffect(() => {
    socket.on("actuators/artificialLight", (data) => {
      if (data) {
        setLightClass("lightTime");

        getLight((date) => {
          const lastLightTime = moment.duration(
            moment(date.endTime).diff(moment())
          );

          configCounter(lastLightTime, "light");
        });
      } else {
        setLightClass("nightTime");

        getLight((date) => {
          const lastLightTime = moment.duration(
            moment().diff(moment(date.startTime))
          );

          configCounter(lastLightTime, "without light");
        });
      }
    });

    axios.get(`${config.server.host}/config`).then((data) => {
      setConfigPlant(data.data.body);
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
        <h2 className="header-light__time">
          {load &&
            `${counter.text}: ${timeEncoder(counter.hours)}:${
              timeEncoder(counter.minutes)
            }:${timeEncoder(counter.seconds)}`}
        </h2>
        <h1 className="header-light__plantName">
          {load && configPlant.PLANT.name}
        </h1>
      </div>
    </header>
  );
};

export default Header;
