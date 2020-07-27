import React, { Component, createRef } from "react";

const Store = ({
  title,
  openingHours,
  adress,
  onFlyTo,
  onEnableTraficDetail,
  coordinates,
  focus,
  weather,
  enabled,
}) => {
  let titleClassName = !focus ? "unFocused-title" : "focused-title";
  let traficButtonClassName = !enabled ? "traficButtonDisabled" : "traficButtonEnabled";
  return (
    <div key={title} className="sideListDiv">
      <div key={title}>
        {
          <h5 className={titleClassName} onClick={() => onFlyTo(coordinates)}>
            {title}
          </h5>
        }
        {<p>{adress}</p>}
        {<p>{openingHours}</p>}
      </div>
      {focus ? (
        <div>
          <img
            className="traficImg"
            src="https://f.nordiskemedier.dk/24lxpprkluqf68lb.jpg"
          />
          <button className={traficButtonClassName} onClick={() => onEnableTraficDetail()}>Hållplatser</button>
        </div>
      ) : null}
      {focus
        ? Object.keys(weather)
            .slice(0, 1)
            .map(() => (
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
