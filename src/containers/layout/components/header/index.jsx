import React, { useEffect, useState } from "react";
import config from "@config";
import "./style/header.scss";
import axios from "axios";

import { Link } from "react-router-dom";

import { io } from "socket.io-client";
import moment, { isMoment } from "moment";

const socket = io(config.server.host);

let globalCounterState = false;

const Header = () => {
  const [lightConfig, setLightConfig] = useState({});
  const [lightClass, setLightClass] = useState("");
  const [configPlant, setConfigPlant] = useState({});
  const [load, setLoad] = useState(false);
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

  const startCounter = (isMounted) => {
    if (!globalCounterState) {
      setInterval(() => {
        if (isMounted)
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

  const configCounter = (isMounted, time, text) => {
    if (isMounted)
      setCounter({
        hours: time.hours(),
        minutes: time.minutes(),
        seconds: time.seconds(),
        text,
      });

    setLoad(true);

    if (!globalCounterState) {
      startCounter(isMounted);
      globalCounterState = true;
    }
  };

  const timeEncoder = (time) => {
    if (time < 10) return "0" + time;
    else return time;
  };

  useEffect(() => {
    let isMounted = true;

    socket.on("actuators/artificialLight", (data) => {
      if (data) {
        setLightClass("lightTime");

        getLight((date) => {
          const lastLightTime = moment.duration(
            moment(date.endTime).diff(moment())
          );

          configCounter(isMounted, lastLightTime, "light");
        });
      } else {
        if (isMounted) setLightClass("nightTime");

        getLight((date) => {
          const lastLightTime = moment.duration(
            moment().diff(moment(date.startTime))
          );

          configCounter(isMounted, lastLightTime, "without light");
        });
      }
    });

    axios.get(`${config.server.host}/config`).then((data) => {
      if (isMounted) setConfigPlant(data.data.body);
    });

    return () => {
      isMounted = false;
    };
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
        <p className="header-light__plantName">
          {load && `Plant Name: ${configPlant.PLANT.name}`}
        </p>
        <p className="header-light__time">
          {load &&
            `Light Info: ${configPlant.PLANT.period_hours_artificial_light} ${
              configPlant.PLANT.period_hours_artificial_light > 1
                ? "hours"
                : "hour"
            } of light - from ${timeEncoder(
              configPlant.PLANT.start_hour_period_artificial_light
            )} to ${moment()
              .hours(
                parseInt(configPlant.PLANT.start_hour_period_artificial_light)
              )
              .add(
                parseInt(configPlant.PLANT.period_hours_artificial_light),
                "hours"
              )
              .format("HH")} - ${counter.text}: ${timeEncoder(
              counter.hours
            )}:${timeEncoder(counter.minutes)}:${timeEncoder(counter.seconds)}`}
        </p>
      </div>
    </header>
  );
};

export default Header;
