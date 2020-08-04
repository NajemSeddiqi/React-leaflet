import React from "react";

const Store = ({
  title,
  openingHours,
  adress,
  onFlyTo,
  onEnableTraficDetail,
  coordinates,
  isFocused,
  weather,
  enabled,
  storeID
}) => {

  let titleClassName = !isFocused ? "unFocused-title" : "focused-title";
  let traficButtonClassName = !enabled
    ? "traficButtonDisabled"
    : "traficButtonEnabled";
    
  return (
    <div key={storeID} className="sideListDiv">
      <div>
        {
          <h5 className={titleClassName} onClick={() => onFlyTo(coordinates)}>
            {title}
          </h5>
        }
        {<p>{adress}</p>}
        {<p>{openingHours}</p>}
      </div>
      {isFocused && (
        <div key={storeID}>
          <img
            alt=""
            className="traficImg"
            src="https://f.nordiskemedier.dk/24lxpprkluqf68lb.jpg"
          />
          <button
            className={traficButtonClassName}
            onClick={() => onEnableTraficDetail()}
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
              <span>{`${weather["temp"]}°`}</span>
              <p>{weather["description"]}</p>
              <img
                src={`http://openweathermap.org/img/w/${weather["icon"]}.png`}
                alt=""
              ></img>
            </div>
          ))}
    </div>
  );
};

export default Store;
