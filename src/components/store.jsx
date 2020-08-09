import React, { useState } from "react";
import adjacency from "../common/adjacency";

/*
 * function component that is the store in the sidelist
 * store and weather information display is handled here
 * traffic information i.e. toggle busstops button is also displayed here
 * */
const Store = ({
  title,
  openingHours,
  address,
  onFlyTo,
  onEnableTrafficDetail,
  coordinates,
  isFocused,
  weather,
  enabled,
  storeID,
}) => {
  let titleClassName = !isFocused ? "unFocused-title" : "focused-title";
  let trafficButtonClassName = !enabled
    ? "trafficButtonDisabled"
    : "trafficButtonEnabled";

  const [index, setIndex] = useState(0);
  const { forecast } = weather;

  let day = "";
  if (forecast !== undefined) {
    const date = new Date(forecast[0][index].dt * 1000);
    day = date.toDateString().substr(0, date.toDateString().length - 4);
  }

  return (
    <div key={storeID} className="sideListDiv">
      <address className={titleClassName} onClick={() => onFlyTo(coordinates)}>
        <b>{title}</b> <br /> {address} <br /> {openingHours}
      </address>
      {isFocused && (
        <div key={storeID}>
          <img
            alt=""
            className="trafficImg"
            src="https://f.nordiskemedier.dk/24lxpprkluqf68lb.jpg"
          />
          <button
            className={trafficButtonClassName}
            onClick={() => onEnableTrafficDetail()}
          >
            Hållplatser
          </button>
        </div>
      )}
      {isFocused &&
        Object.keys(weather)
          .slice(0, 1)
          .map(() => (
            <div className="weather-div" key={storeID}>
              <span>
                <b>{day}</b>
              </span>
              <br />
              <span>
                <b>{`${forecast[0][index].temp.day}°`}</b>
              </span>
              <img
                src={`http://openweathermap.org/img/w/${forecast[0][index].weather[0].icon}.png`}
                alt=""
              />
              <br />
              <b>{forecast[0][index].weather[0].description}</b>
              <br />
              <div>
                <p
                  className="arrow left"
                  onClick={() => adjacency.prev([index, setIndex, forecast[0]])}
                />
                <p
                  className="arrow right"
                  onClick={() => adjacency.next([index, setIndex, forecast[0]])}
                />
              </div>
            </div>
          ))}
    </div>
  );
};

export default Store;
