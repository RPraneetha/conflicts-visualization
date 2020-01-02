import React, { memo, useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import './WorldMap.css';

const conflictData = require("../../data/data.json").data;

/* Schema
{
    "monthYear": 201402,
    "protestDetails": {
      "CameoCode": "141",
      "ProtestType": "DEMONSTRATION OR RALLY",
      "Cause": null
    },
    "quadClass": {
      "id": 3,
      "name": " Verbal Conflict"
    },
    "impact": -6.5,
    "location": {
      "locType": 4,
      "fullName": "Beijing, Beijing, China",
      "city": "Beijing",
      "state": " Beijing",
      "country": " China",
      "countryCode": "CH",
      "adm1Code": "CH22",
      "adm2Code": "13001",
      "lat": 39.92890167236328,
      "lng": 116.38800048828125,
      "featureId": "-1898541"
    }
  }
 */

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const WorldMap = ({setTooltipContent}) => {
    // const [ conflictData, setConflictData ] = useState([]);

    useEffect(() => {
        // setConflictData(conflictData);
        // fetch("../../data/data.json")
        //     .then(response => {
        //         if (response.status !== 200) {
        //             console.log(`There was a problem: ${response.status}`);
        //             return
        //         }
        //         console.log(response.json())
        //         response.json().then((conflictData) => {
        //                 console.log(conflictData)
        //                 // setConflictData(conflictData.data);
        //         })
        //     })
    }, []);

    const handleCountryClick = (geographies, countryIndex) => {
        //TODO Add ref to display content for country click and marker click
        console.log("Clicked on country: ", geographies[countryIndex])
    };

    const handleMarkerClick = i => {
        console.log("Marker: ", conflictData[i].location.fullName)
    };

    //Include Greticule?
    return (
        <ComposableMap className="mapContainer">
            <ZoomableGroup zoom={1}>
                <svg className="worldMap">
                    <Geographies className="countries" geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo, i) =>
                                <Geography
                                    className="country"
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={ `rgba(255, 34, 12,${ 1 / geographies.length * i})` }
                                    onClick={ () => handleCountryClick(geo, i) }
                                />)
                        }
                    </Geographies>
                    {conflictData.map((conflictEvent, index) => (
                        <Marker className="markers" data-tip="" key={ `marker-${index}` }
                                coordinates={[conflictEvent.location.lng.toFixed(4), conflictEvent.location.lat.toFixed(4)]}>
                            <circle
                                className="marker"
                                r={5}
                                onClick={ () => handleMarkerClick(index) }
                                onMouseEnter={() => {
                                setTooltipContent("TEXT GOES HERE");
                                }}
                                onMouseLeave={() => {
                                setTooltipContent("");
                                }}
                            />
                        </Marker>
                    ))}
                </svg>
            </ZoomableGroup>
        </ComposableMap>
    )
};

export default memo(WorldMap)
