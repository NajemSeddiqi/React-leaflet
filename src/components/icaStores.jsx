import React, { Component } from "react";
import Store from "./icaStore";

const Stores = ({ onFlyTo, data, weather, enabled, onEnableTraficDetail }) => {
  
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
          onEnableTraficDetail={onEnableTraficDetail}
          city={s.city}
          coordinates={s.coordinates}
          weather={weather}
          enabled={enabled}
        />
      ))}
    </div>
  );
};

export default Stores;
