import React, { Component, createContext, createRef } from "react";
import { Map, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";
import getIcaStores from "../jsondata/icaStores.json";
import http from "../services/httpService";
import Stores from "./stores";
import StoreMarkers from "./storeMarkers";
import BussStopMarkers from "./bussStopMarkers";

export const MapContext = createContext();

/*
 * this class does most of the heavy lifting in terms of receiving data
 * componentDidMount gets our store data and sets the state
 * */

class MyMap extends Component {
  state = {
    data: [],
    weather: {},
    traffic: [],
    enabled: false,
  };

  map = createRef();

  async componentDidMount() {
    const stores = getIcaStores.features;
    const data = stores.map((s) => ({
      store: s.properties.store,
      address: s.properties.address,
      openingHours: s.properties.openingHours,
      picUrl: s.properties.picURL,
      website: s.properties.website,
      isFocused: false,
      city: s.properties.city,
      coordinates: s.geometry.coordinates.reverse(),
    }));
    this.setState({ data });
  }

  //This method gets weather and traffic data when use clicks on a store in the sideList
  handleFlyTo = (coordinates) => {
    this.setState((prevState) => ({
      data: prevState.data.map((i) =>
        i.coordinates === coordinates
          ? { ...i, isFocused: true }
          : { ...i, isFocused: false }
      ),
      weather: this.getWeather(coordinates).then((weather) =>
        this.setState({ weather })
      ),
      traffic: this.getTrafficInformation(coordinates).then((traffic) =>
        this.setState({ traffic })
      ),
      enabled: false,
    }));
    this.map.current.leafletElement.closePopup();
    this.map.current.leafletElement.flyTo(coordinates, 13);
  };

  getWeather = async (coordinates) => {
    const [lat, lng] = coordinates;
    const { data } = await http.get(http.getWeatherURI(lat, lng));
    try {
      return {
        id: data.current.weather[0].id,
        temp: data.current.temp,
        humidity: data.current.humidity,
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        forecast: [data.daily],
      };
    } catch (ex) {}
  };

  getTrafficInformation = async (coordinates) => {
    const [lat, lng] = coordinates;
    const { data } = await http.get(http.getTrafficURI(lat, lng));
    try {
      return data.StopLocation.map((t) => ({
        id: t.id,
        name: t.name,
        coordinates: [t.lat, t.lon],
        products: t.products,
        weight: t.weight,
      }));
    } catch (ex) {}
  };

  handleEnableTrafficDetail = () => {
    if (this.state.traffic === undefined) {
      toast.error("Det finns för närvarande inga tillgängliga hållplatser.");
    } else {
      this.setState({ enabled: !this.state.enabled });
    }
  };

  render() {
    const { data, traffic, enabled } = this.state;
    return (
      <div className="mapAndList">
        <div className="sideList">
          {/* sfc */}
          {/* Needed many props so decided to use context instead to clean it up */}
          <MapContext.Provider
            value={{
              state: this.state,
              onFlyTo: this.handleFlyTo,
              onEnableTrafficDetail: this.handleEnableTrafficDetail,
            }}
          >
            <Stores />
          </MapContext.Provider>
        </div>
        <div className="leaflet-container">
          <Map ref={this.map} center={[60.50274, 15.41921]} zoom={8}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            {/* Sfc */}
            <StoreMarkers data={data} />
            {/* Component class because it exceeded three methods and definitely required a state */}
            <BussStopMarkers enabled={enabled} traffic={traffic} />
          </Map>
        </div>
      </div>
    );
  }
}

export default MyMap;
