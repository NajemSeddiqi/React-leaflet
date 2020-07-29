import React, { Component } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { createRef } from "react";
import { toast } from "react-toastify";
import getIcaStores from "../jsondata/icaStores.json";
import http from "../services/httpService";
import Stores from "./stores";
import StoreMarkers from "./storeMarkers";
import BussStopMarkers from "./bussStopMarkers";

class MyMap extends Component {
  state = {
    data: [],
    weather: {},
    trafic: [],
    enabled: false,   
  };

  map = createRef();

  async componentDidMount() {
    const stores = getIcaStores.features;
    const data = stores.map((s) => ({
      store: s.properties.store,
      adress: s.properties.adress,
      openingHours: s.properties.openingHours,
      picUrl: s.properties.picURL,
      website: s.properties.website,
      focused: false,
      city: s.properties.city,
      coordinates: s.geometry.coordinates.reverse(),
    }));
    this.setState({ data });
  }

  handleFlyTo = (coordinates) => {
    this.setState((prevState) => ({
      data: prevState.data.map((i) =>
        i.coordinates === coordinates
          ? { ...i, focused: true }
          : { ...i, focused: false }
      ),
      weather: this.getWeather(coordinates).then((weather) =>
        this.setState({ weather })
      ),
      trafic: this.getTraficInformation(coordinates).then((trafic) =>
        this.setState({ trafic })
      ),
      enabled: false,
    }));
    this.map.current.leafletElement.closePopup();
    this.map.current.leafletElement.flyTo(coordinates, 13);
  };

  handleEnableTraficDetail = () => {
    if (this.state.trafic === undefined) {
      toast.error("Det finns för närvarande inga tillgängliga hållplatser.");
    } else {
      this.setState({ enabled: !this.state.enabled });
    }
  };

  getWeather = async (coordinates) => {
    const [lat, lng] = coordinates;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=25f4530d6bd98eb444ce6b94f8db1ef8`;
    const { data } = await http.get(url);
    try {
      const obj = {
        id: data.id,
        temp: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        enabled: false,
      };
      return obj;
    } catch (ex) {}
  };

  getTraficInformation = async (coordinates) => {
    let [lat, lng] = coordinates;
    let url = `https://api.resrobot.se/v2/location.nearbystops?key=c4b5de66-b9c7-471f-86cc-289685544c58&originCoordLat=${lat}&originCoordLong=${lng}&format=json`;
    const { data } = await http.get(url);
    try {
      const trafic = data.StopLocation.map((t) => ({
        id: t.id,
        name: t.name,
        coordinates: [t.lat, t.lon],
        products: t.products,
        weight: t.weight,
      }));
      return trafic;
    } catch (ex) {}
  };

  render() {
    const {
      data,
      weather,
      trafic,
      enabled,
    } = this.state;

    return (
      <div className="mapAndList">
        <div className="sideList">
          {/* sfc */}
          <Stores
            data={data}
            weather={weather}
            enabled={enabled}
            onFlyTo={this.handleFlyTo}
            onEnableTraficDetail={this.handleEnableTraficDetail}
          />
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
            <BussStopMarkers
              enabled={enabled}
              trafic={trafic}
            />
          </Map>
        </div>
      </div>
    );
  }
}

export default MyMap;
