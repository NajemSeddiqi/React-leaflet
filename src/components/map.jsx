import React, { Component } from "react";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  ScaleControl,
} from "react-leaflet";
import { createRef } from "react";
import Stores from "./icaStores";
import getIcaStores from "../jsondata/icaStores.json";
import Axios from "axios";

class MyMap extends Component {
  state = {
    data: [],
    weather: {},
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
      focused: true,
      coordinates: s.geometry.coordinates.reverse(),
    }));

    this.setState({ data });
  }

  handleFlyTo = (coordinates) => {
    this.setState((prevState) => ({
      data: prevState.data.map((i) =>
        i.coordinates === coordinates
          ? { ...i, focused: false }
          : { ...i, focused: true }
      ),
      weather: this.getWeather(coordinates).then(weather => this.setState({weather})),
    }));
    this.map.current.leafletElement.flyTo(coordinates, 13);
  };

  getWeather = async (coordinates) => {
    const [lat, lng] = coordinates;
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=25f4530d6bd98eb444ce6b94f8db1ef8`;
    const { data } = await Axios.get(url);
    const obj = {
      id: data.id,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
    return obj;
  };

  render() {
    const { data, weather } = this.state;
    return (
      <div className="mapAndList">
        <div className="sideList">
          <Stores data={data} weather={weather} onFlyTo={this.handleFlyTo} />
        </div>
        <div className="leaflet-container">
          <Map
            ref={this.map}
            center={[60.50274, 15.41921]}
            zoom={8}
          >
            <TileLayer
              attribution={this.state.weather["temp"]}
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            {data.map((pos, idx) => (
              <Marker key={idx} position={pos.coordinates}>
                <Popup>
                  <span>{pos.coordinates}</span>
                </Popup>
              </Marker>
            ))}
          </Map>
        </div>
      </div>
    );
  }
}

export default MyMap;
