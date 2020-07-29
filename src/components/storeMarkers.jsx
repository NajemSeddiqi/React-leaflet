import React from "react";
import { Marker, Popup} from "react-leaflet";
import L from "leaflet";
import redIcon from "../common/redIcon.png";


const StoreMarkers = ({data}) => {
    const storeIcon = L.icon({ iconUrl: redIcon, iconSize: [38, 42] });  
    return ( <React.Fragment>
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
      </React.Fragment> );
}
 
export default StoreMarkers;
