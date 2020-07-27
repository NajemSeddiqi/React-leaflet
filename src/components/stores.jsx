import React, { Component } from "react";
import Store from "./store";

const Stores = ({ onFlyTo, data, weather, enabled, onEnableTraficDetail, onDisableTraficDetail }) => {
  
  return (
    <div>
      {data.map((s, idx) => (
        <Store
          focus={s.focused}
          key={idx}
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
