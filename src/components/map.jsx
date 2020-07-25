import React, { Component } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { createRef } from "react";
import { toast } from "react-toastify";
import L from "leaflet";
import getIcaStores from "../jsondata/icaStores.json";
import http from "../services/httpService";
import Stores from "./stores";
import redIcon from "../common/redIcon.png";
import bussIcon from "../common/bussStopIcon.png";
import bussAvailableIcon from "../common/bussAvailable.png";
import bussUnavailableIcon from "../common/bussUnavailable.png";

class MyMap extends Component {
  state = {
    data: [],
    weather: {},
    trafic: [],
    departures: [],
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

  handleDepartureData = async (id) => {
    let url = `https://api.resrobot.se/v2/departureBoard?key=6e22f881-8d86-4669-8c8d-3eddc81c36c9&id=${id}&maxJourneys=5&format=json`;
    const { data } = await http.get(url);
    try {
      const departures = data.Departure.map((d) => ({
        operator: d.Product.operator,
        date: d.date,
        time: d.time,
        transportNumber: d.transportNumber,
        stopId: d.stopid,
      }));
      this.setState({ departures });
      console.log(departures);
    } catch (ex) {}
  };

  render() {
    const { data, weather, trafic, departures, enabled } = this.state;
    const storeIcon = L.icon({ iconUrl: redIcon, iconSize: [38, 42] });
    const bussStopIcon = L.icon({ iconUrl: bussIcon, iconSize: [30, 35] });

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
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            {data.map((pos, idx) => (
              <Marker key={idx} position={pos.coordinates} icon={storeIcon}>
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
            {enabled && trafic !== undefined
              ? trafic.map((pos, idx) => (
                  <Marker
                    key={idx}
                    position={pos.coordinates}
                    icon={bussStopIcon}
                    onclick={() => this.handleDepartureData(pos.id)}
                  >
                    <Popup>
                      {departures.length > 0 ? (
                        departures.slice(0, 1).map((d) => (
                          <div className="popUpDiv">
                            <img src={bussAvailableIcon} style={{display: "block", marginLeft: "auto", marginRight: "auto"}}/> <br /><br />
                            <span>
                              Nästa buss går {d.date} klockan {d.time}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="popUpDiv">
                          <img src={bussUnavailableIcon}  style={{display: "block", marginLeft: "auto", marginRight: "auto"}} /> <br /><br />
                          <span>
                            Det finns inga tilgängliga anländningtider just nu.
                          </span>
                        </div>
                      )}
                    </Popup>
                  </Marker>
                ))
              : null}
          </Map>
        </div>
      </div>
    );
  }
}

export default MyMap;
