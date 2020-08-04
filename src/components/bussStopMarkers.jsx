import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import http from "../services/httpService";
import bussIcon from "../common/bussStopIcon.png";
import bussAvailableIcon from "../common/bussAvailable.png";
import bussUnavailableIcon from "../common/bussUnavailable.png";

class BussStopMarkers extends Component {
  state = {
    departures: [],
    index: 0,
    isHovering: false,
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
      this.setState({ departures, index: 0 });
    } catch (ex) { }
  };

  handleSpanTimeTouch = () => {
    this.setState((prevState) => ({ isHovering: !prevState.isHovering }));
  };

  handleNextDeparture = () => {
    const { index, departures } = this.state;
    if (index === departures.length - 1) return;
    this.setState((prevState) => ({ index: prevState.index + 1 }));
  };

  handlePrevDeparture = () => {
    const { index } = this.state;
    if (index === 0) return;
    this.setState((prevState) => ({ index: prevState.index - 1 }));
  };

  render() {
    const { trafic, enabled } = this.props;
    const { departures, index, isHovering } = this.state;
    const bussStopIcon = L.icon({ iconUrl: bussIcon, iconSize: [30, 35] });
    const firstIndex = index === 0;
    const lastIndex = index === departures.length - 1;
    return (
      <React.Fragment>
        {enabled && trafic !== undefined
          ? trafic.map((pos, idx) => (
            <Marker
              key={idx}
              position={pos.coordinates}
              icon={bussStopIcon}
              onclick={() => this.handleDepartureData(pos.id)}
            >
              <Popup>
                {departures.length > 0 && departures[index] !== undefined ? (
                  <div className="popUpDiv">
                    <img
                      alt=""
                      src={bussAvailableIcon}
                      style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                    <br />
                    <br />
                    {isHovering && (
                      <div className="toolTip">
                        <ul>
                          {departures.map((d, idx) => (
                            <li className="toolTip" key={idx}>{d.time}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <span>
                      Nästa buss går {departures[index]["date"]} klockan{" "}
                      <b
                        onMouseEnter={this.handleSpanTimeTouch}
                        onMouseLeave={this.handleSpanTimeTouch}
                      >
                        {departures[index]["time"]}
                      </b>
                    </span>
                    <br />
                    <div className="departurePopUpBtns">
                      <button
                        className="departurePopUpBtn"
                        onClick={() => this.handlePrevDeparture()}
                        disabled={firstIndex ? true : false}
                        style={firstIndex ? {color: "#080808"} : {color: "#FFFFFF"}}
                      >
                        Föregående
                        </button>
                      <button
                        className="departurePopUpBtn"
                        onClick={() => this.handleNextDeparture()}
                        disabled={lastIndex ? true : false}
                        style={lastIndex ? {color: "#080808"} : {color: "#FFFFFF"}}
                      >
                        Nästa
                        </button>
                    </div>
                  </div>
                ) : (
                    <div className="popUpDiv">
                      <img
                        alt=""
                        src={bussUnavailableIcon}
                        style={{
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />{" "}
                      <br />
                      <br />
                      <span>
                        Det finns inga tilgängliga anländningtider just nu.
                      </span>
                    </div>
                  )}
              </Popup>
            </Marker>
          ))
          : null}
      </React.Fragment>
    );
  }
}

export default BussStopMarkers;
