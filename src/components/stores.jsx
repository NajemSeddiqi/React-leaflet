import React, {useContext} from "react";
import {MapContext} from './map';
import Store from "./store";

const Stores = () => {
  const {state, onFlyTo, onEnableTraficDetail} = useContext(MapContext);
  
  return (
    <div>
      {state.data.map((s, idx) => (
        <Store
          isFocused={s.isFocused}
          key={idx}
          storeID={idx}
          title={s.store}
          openingHours={s.openingHours}
          adress={s.adress}
          onFlyTo={onFlyTo}
          onEnableTraficDetail={onEnableTraficDetail}
          city={s.city}
          coordinates={s.coordinates}
          weather={state.weather}
          enabled={state.enabled}
        />
      ))}
    </div>
  );
};

export default Stores;
