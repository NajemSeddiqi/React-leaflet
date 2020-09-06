import React, { useContext } from "react";
import { MapContext } from "./myMap";
import ProgressBar from "react-bootstrap/ProgressBar";
import Store from "./store";

const Stores = () => {
  const {
    state,
    stores,
    onFlyTo,
    onEnableTrafficDetail,
    onProvinceSelect,
    progress,
  } = useContext(MapContext);

  const options = [
    { value: "Hälsingland", label: "Gävleborg" },
    { value: "Dalarna", label: "Dalarna" },
    { value: "Stockholms län", label: "Stockholms län" },
  ];

  return (
    <React.Fragment>
      <div>
        <div style={{ padding: "10px" }}>
          <select
            className="custom-select"
            onChange={(e) => onProvinceSelect(e.target.value)}
          >
            <option value="">Välj län..</option>
            {options.map((o) => (
              <option value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        {!state.isLoading ? (
          stores.map((s, idx) => (
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
              isEnabled={state.isEnabled}
            />
          ))
        ) : (
          <div style={{ margin: "120px" }}>
            <ProgressBar animated now={progress} label={`${progress}%`} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Stores;
