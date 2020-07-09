import React, { Component, createRef } from "react";

const Store = ({
  title,
  openingHours,
  adress,
  onFlyTo,
  coordinates,
  focus,
  weather,
}) => {
  return (
    <div style={{ margin: "5px", padding: "5px", border: "1px red solid" }}>
      {
        <h3
          className={focus ? "unFocused-title" : "focused-title"}
          onClick={() => onFlyTo(coordinates)}
        >
          {title}
        </h3>
      }
      {<p>{adress}</p>}
      {<p>{openingHours}</p>}
      {!focus
        ? Object.keys(weather)
            .slice(0, 1)
            .map((k, i) => (
              <div className="weather-div">
                <span>{`${weather["temp"]}°`}</span>
                <p>{weather["description"]}</p>
                <img
                  src={`http://openweathermap.org/img/w/${weather["icon"]}.png`}
                ></img>
              </div>
            ))
        : null}
      {/* {Object.keys(weather).map(k => {
        return focus ? <div style={{float:"right", margin: "-112px 0px 0px 0px"}}>
          <span>{weather[k].temp}Hello dadsd</span>
        </div> : null
      })} */}
    </div>
  );
};

export default Store;
