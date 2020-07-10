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
import http from "../services/httpService";
import Stores from "./icaStores";
import getIcaStores from "../jsondata/icaStores.json";

class MyMap extends Component {
  state = {
    data: [],
    weather: {},
    trafic: [],
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

  handleFlyTo = (coordinates, city) => {
    this.setState((prevState) => ({
      data: prevState.data.map((i) =>
        i.coordinates === coordinates
          ? { ...i, focused: true }
          : { ...i, focused: false }
      ),
      weather: this.getWeather(coordinates).then((weather) =>
        this.setState({ weather })
      ),
      trafic: this.getTraficInformation(city).then((trafic) =>
        this.setState({ trafic })
      ),
    }));
    this.map.current.leafletElement.flyTo(coordinates, 13);
  };

  handleEnableTraficDetail = (traficClassName) => {
    const trafic = [...this.state.trafic];
    
    console.log(traficClassName);
    console.log(this.state.trafic);
  };

  getWeather = async (coordinates) => {
    const [lat, lng] = coordinates;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=25f4530d6bd98eb444ce6b94f8db1ef8`;
    const { data } = await http.get(url);
    const obj = {
      id: data.id,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      enabled: false,
    };
    return obj;
  };

  getTraficInformation = async (location) => {
    let url = `https://api.resrobot.se/v2/location.name?key=c4b5de66-b9c7-471f-86cc-289685544c58&input=${location}?&format=json`;
    const { data } = await http.get(url);
    const trafic = data.StopLocation.map((t) => ({
      id: t.id,
      name: t.name,
      coordinates: [t.lat, t.lon],
      products: t.products,
      weight: t.weight,
    }));
    return trafic;
  };

  render() {
    const { data, weather } = this.state;
    const { enabled } = this.state.trafic;
    return (
      <div className="mapAndList">
        <div className="sideList">
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
                  <div className="popUpDiv">
                    <img className="storeImg" src={pos.picUrl} />
                    <br />
                    <span>
                      <b>Adress: </b>
                      {pos.store}
                    </span>
                    <br />
                    <span>
                      <b>Öppettider: </b>
                      {pos.openingHours}
                    </span>
                    <br />
                    <br />
                    <span>
                      <b>Hemsida: </b>
                    </span>
                    <a href={pos.website} target="_blank">
                      Klicka här
                    </a>
                  </div>
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
