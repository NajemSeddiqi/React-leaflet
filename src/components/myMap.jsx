import React, { Component, createContext, createRef } from "react";
import { Map, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";
import { getWeather } from "../services/weatherService";
import { getTraffic } from "../services/trafficService";
import { getStores } from "../services/storeService";
import Builder from "../helpers/apiResponseObjectbuilder";
import Stores from "./stores";
import StoreMarkers from "./storeMarkers";
import BussStopMarkers from "./bussStopMarkers";
import loadProgress from "./../helpers/progressBarLoader";

export const MapContext = createContext(undefined, undefined);

/*
 * this class does most of the heavy lifting in terms of receiving data
 * */

class MyMap extends Component {
  state = {
    data: [],
    weather: {},
    traffic: [],
    isEnabled: false,
    isLoading: true,
    progress: 0,
  };

  map = createRef();

  async componentDidMount() {
    document.title = "Store Tracker";
    loadProgress(this, 13);

    const { data } = await getStores();
    const stores = Builder.buildStoreObj(data);
    this.setState({ data: stores, isLoading: false });

    const { id } = this.props.match.params;
    if (id !== undefined) this.setImmediateFocus(id);
  }

  //Is is called if the user comes to this component via the storeList component
  setImmediateFocus = (id) => {
    try {
      const store = this.state.data.filter((i) => i.id === id)[0];
      const data = [...this.state.data];
      const index = data.indexOf(store);
      data[index].isFocused = !data[index].isFocused;
      this.handleFlyTo(store.coordinates);
    } catch (ex) {
      toast.error("Ett fel uppstod. Vänligen försök igen.");
    }
  };

  //This method gets weather and traffic data when use clicks on a store in the sideList
  handleFlyTo = (coordinates) => {
    this.setState((prevState) => ({
      data: prevState.data.map((i) =>
        i.coordinates === coordinates
          ? { ...i, isFocused: true }
          : { ...i, isFocused: false }
      ),
      weather: this.setWeatherState(coordinates),
      traffic: this.setTrafficState(coordinates),
      isEnabled: false,
    }));

    this.flyToMap(coordinates, 13);
  };

  flyToMap = (coordinates, zoom) => {
    this.map.current.leafletElement.closePopup();
    this.map.current.leafletElement.flyTo(coordinates, zoom);
  };

  backToCenterView = () => {
    this.map.current.leafletElement.closePopup();
    this.map.current.leafletElement.setView([60.50274, 15.41921], 7);
  };

  setWeatherState = async (coordinates) => {
    const weather = await this.getWeather(coordinates);
    return this.setState({ weather });
  };

  setTrafficState = async (coordinates) => {
    const traffic = await this.getTrafficInformation(coordinates);
    return this.setState({ traffic });
  };

  getWeather = async (coordinates) => {
    const [lat, lng] = coordinates;
    const { data } = await getWeather(lat, lng);
    return Builder.buildWeatherObj(data);
  };

  getTrafficInformation = async (coordinates) => {
    const [lat, lng] = coordinates;
    const { data } = await getTraffic(lat, lng);
    return Builder.buildTrafficObj(data);
  };

  handleEnableTrafficDetail = () => {
    if (this.state.traffic === undefined) {
      toast.error("Det finns för närvarande inga tillgängliga hållplatser.");
    } else {
      this.setState({ isEnabled: !this.state.isEnabled });
    }
  };

  filterByProvince = () => {
    const { selectedProvince, data: stores } = this.state;

    let filtered = stores;
    if (selectedProvince) {
      filtered = stores.filter((s) => s.province.name === selectedProvince);
    }

    return { data: filtered };
  };

  handleProvinceSelect = (province) => {
    this.setState({ selectedProvince: province });
    this.backToCenterView();
  };

  render() {
    const { traffic, isEnabled, progress } = this.state;

    const { data } = this.filterByProvince();

    return (
      <div className="mapAndList">
        <div className="sideList">
          {/* sfc */}
          {/* Needed many props so decided to use context instead to clean it up */}
          <MapContext.Provider
            value={{
              state: this.state,
              stores: data,
              onFlyTo: this.handleFlyTo,
              onEnableTrafficDetail: this.handleEnableTrafficDetail,
              onProvinceSelect: this.handleProvinceSelect,
              progress: progress,
            }}
          >
            <Stores />
          </MapContext.Provider>
        </div>
        <div className="leaflet-container">
          <Map ref={this.map} center={[60.50274, 15.41921]} zoom={7}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            {/* Sfc */}
            <StoreMarkers data={data} />
            {/* Component class because it exceeded three methods and definitely required a state */}
            <BussStopMarkers isEnabled={isEnabled} traffic={traffic} />
          </Map>
        </div>
      </div>
    );
  }
}

export default MyMap;
