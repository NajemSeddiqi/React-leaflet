import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";
import adjacency from "../common/adjacency";
import L from "leaflet";
import http from "../services/httpService";
import bussIcon from "../common/bussStopIcon.png";
import bussAvailableIcon from "../common/bussAvailable.png";
import bussUnavailableIcon from "../common/bussUnavailable.png";

/*
 * this class handles the display options of the busstop markers as well as their popup logic
 * data is departures (5 max)
 * index is used to toggle next and previous arrival times for each busstop location
 * isHovering is used for the tooltip that displays all 5 departure times when user is hovering over current arrival time
 * */
class BussStopMarkers extends Component {
  state = {
    data: [],
    index: 0,
    isHovering: false,
  };

  getDepartureData = async (id) => {
    const { data } = await http.get(http.getDepartureURL(id));
    try {
      const departureData = data.Departure.map((d) => ({
        operator: d.Product.operator,
        date: d.date,
        time: d.time,
        transportNumber: d.transportNumber,
        stopId: d.stopid,
      }));
      this.setState({ data: departureData, index: 0 });
    } catch (ex) {}
  };

  handleArrivalTimeHover = () => {
    this.setState((prevState) => ({ isHovering: !prevState.isHovering }));
  };

  render() {
    const { traffic, enabled } = this.props;
    const { data, index, isHovering } = this.state;
    const firstIndex = index === 0;
    const lastIndex = index === data.length - 1;

    const bussStopIcon = L.icon({ iconUrl: bussIcon, iconSize: [30, 35] });
    return (
      <React.Fragment>
        {enabled && traffic !== undefined
          ? traffic.map((pos, idx) => (
              <Marker
                key={idx}
                position={pos.coordinates}
                icon={bussStopIcon}
                onclick={() => this.getDepartureData(pos.id)}
              >
                <Popup>
                  {data.length > 0 && data[index] !== undefined ? (
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
                            {data.map((d, idx) => (
                              <li className="toolTip" key={idx}>
                                {d.time}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <span>
                        Nästa buss går <b>{data[index]["date"]}</b> klockan{" "}
                        <b
                          onMouseEnter={this.handleArrivalTimeHover}
                          onMouseLeave={this.handleArrivalTimeHover}
                        >
                          {data[index]["time"]}
                        </b>
                      </span>
                      <br />
                      <div className="departurePopUpBtns">
                        <button
                          className="departurePopUpBtn"
                          onClick={() => adjacency.prev(this)}
                          disabled={firstIndex}
                          style={
                            firstIndex
                              ? { color: "#080808" }
                              : { color: "#FFFFFF" }
                          }
                        >
                          Föregående
                        </button>
                        <button
                          className="departurePopUpBtn"
                          onClick={() => adjacency.next(this)}
                          disabled={lastIndex}
                          style={
                            lastIndex
                              ? { color: "#080808" }
                              : { color: "#FFFFFF" }
                          }
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
