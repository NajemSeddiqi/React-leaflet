import React, { Component, createRef } from "react";

const Store = ({
  title,
  openingHours,
  adress,
  onFlyTo,
  onEnableTraficDetail,
  onDisableTraficDetail,
  coordinates,
  focus,
  city,
  weather,
  enabled,
}) => {
  let traficClassName = !enabled ? "disabled-traffic" : "enabled-traffic";
  let titleClassName = !focus ? "unFocused-title" : "focused-title";
  return (
    <div className="sideListDiv">
      <div>
        {
          <h5 className={titleClassName} onClick={() => onFlyTo(coordinates, city)}>
            {title}
          </h5>
        }
        {<p>{adress}</p>}
        {<p>{openingHours}</p>}
      </div>
      {focus ? (
        <div className={traficClassName}>
          <img
            className="traficImg"
            src="https://f.nordiskemedier.dk/24lxpprkluqf68lb.jpg"
          />
          <div className="traficBtns"> 
          <button className="btn-primary" onClick={() => onEnableTraficDetail(city)}>On</button>
          <button className="btn-primary" onClick={() => onDisableTraficDetail(city)}>Off</button>
          </div>
        </div>
      ) : null}
      {focus
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
    </div>
  );
};

export default Store;
