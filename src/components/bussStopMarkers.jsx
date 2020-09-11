import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";
import { getDepartures } from "../services/trafficService";
import Spinner from "react-bootstrap/Spinner";
import Builder from "../helpers/apiResponseObjectbuilder";
import adjacency from "../helpers/adjacency";
import L from "leaflet";
import bussIcon from "../assets/bussStopIcon.png";
import bussAvailableIcon from "../assets/bussAvailable.png";

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
    const { data } = await getDepartures(id);
    const departureData = Builder.buildDepartureObj(data);
    this.setState({ data: departureData, index: 0 });
  };

  handleArrivalTimeHover = () => {
    this.setState((prevState) => ({ isHovering: !prevState.isHovering }));
  };

  render() {
    const { traffic, isEnabled } = this.props;
    const { data, index, isHovering } = this.state;
    let firstIndex;
    let lastIndex;

    if (data !== undefined) {
      firstIndex = index === 0;
      lastIndex = index === data.length - 1;
    }

    const bussStopIcon = L.icon({ iconUrl: bussIcon, iconSize: [30, 35] });
    return (
      <React.Fragment>
        {isEnabled && traffic !== undefined
          ? traffic.map((pos, idx) => (
              <Marker
                key={idx}
                position={pos.coordinates}
                icon={bussStopIcon}
                onclick={() => this.getDepartureData(pos.id)}
              >
                <Popup>
                  {data !== undefined && data.length > 0 ? (
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
                      <Spinner
                        animation="border"
                        variant="danger"
                        style={{
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
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
