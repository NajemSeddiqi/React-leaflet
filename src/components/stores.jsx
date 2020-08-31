import React, { useContext } from "react";
import { MapContext } from "./map";
import Store from "./store";

const Stores = () => {
  const { state, onFlyTo, onEnableTrafficDetail } = useContext(MapContext);
  return (
    <div>
      {!state.isLoading ? (
        state.data.map((s, idx) => (
          <Store
            isFocused={s.isFocused}
            key={idx}
            storeID={idx}
            title={s.store}
            openingHours={s.openingHours}
            address={s.address}
            onFlyTo={onFlyTo}
            onEnableTrafficDetail={onEnableTrafficDetail}
            city={s.city}
            coordinates={s.coordinates}
            weather={state.weather}
            enabled={state.enabled}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Stores;
