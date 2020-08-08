import React, { Component, createContext, createRef } from "react";
import { Map, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";
import getIcaStores from "../jsondata/icaStores.json";
import http from "../services/httpService";
import Stores from "./stores";
import StoreMarkers from "./storeMarkers";
import BussStopMarkers from "./bussStopMarkers";

export const MapContext = createContext();

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

  handleEnableTrafficDetail = () => {
    if (this.state.traffic === undefined) {
      toast.error("Det finns för närvarande inga tillgängliga hållplatser.");
    } else {
      this.setState({ enabled: !this.state.enabled });
    }
  };

  getWeather = async (coordinates) => {
    const [lat, lng] = coordinates;
    const URI = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly&lang=se&units=metric&appid=25f4530d6bd98eb444ce6b94f8db1ef8`;
    const { data } = await http.get(URI);
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
    let [lat, lng] = coordinates;
    let URI = `https://api.resrobot.se/v2/location.nearbystops?key=c4b5de66-b9c7-471f-86cc-289685544c58&originCoordLat=${lat}&originCoordLong=${lng}&format=json`;
    const { data } = await http.get(URI);
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
