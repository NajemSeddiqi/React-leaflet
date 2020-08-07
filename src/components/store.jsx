import React from "react";

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
                <b>{`${weather["temp"]}°`}</b>
              </span>
              <br />
              <b>{weather["description"]}</b>
              <br />
              <img
                src={`http://openweathermap.org/img/w/${weather["icon"]}.png`}
                alt=""
              />
              <div>
                <p className="arrow left" />
                <p className="arrow right" />
              </div>
            </div>
          ))}
    </div>
  );
};

export default Store;
