import React, { Component } from "react";
import Store from "./icaStore";

const Stores = ({ onFlyTo, data, weather }) => {
  
  return (
    <div>
      {data.map((s, idx) => (
        <Store
          focus={s.focused}
          key={s.store}
          title={s.store}
          openingHours={s.openingHours}
          adress={s.adress}
          onFlyTo={onFlyTo}
          coordinates={s.coordinates}
          weather={weather}
        />
      ))}
    </div>
  );
};

export default Stores;
