import React, { useState, useEffect } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { ComposableMap, ZoomableGroup } from "react-simple-maps";
import './WorldMap.css';

const worldMapData = require("../../data/world-110m");
const conflictData = require("../../data/data.json").data;

const cities = [
    { name: "Tokyo",          coordinates: [139.6917,35.6895],  population: 37843000 },
    { name: "Jakarta",        coordinates: [106.8650,-6.1751],  population: 30539000 },
    { name: "Delhi",          coordinates: [77.1025,28.7041],   population: 24998000 },
    { name: "Manila",         coordinates: [120.9842,14.5995],  population: 24123000 },
    { name: "Seoul",          coordinates: [126.9780,37.5665],  population: 23480000 },
    { name: "Shanghai",       coordinates: [121.4737,31.2304],  population: 23416000 },
    { name: "Karachi",        coordinates: [67.0099,24.8615],   population: 22123000 },
    { name: "Beijing",        coordinates: [116.4074,39.9042],  population: 21009000 },
    { name: "New York",       coordinates: [-74.0059,40.7128],  population: 20630000 },
    { name: "Guangzhou",      coordinates: [113.2644,23.1291],  population: 20597000 },
    { name: "Sao Paulo",      coordinates: [-46.6333,-23.5505], population: 20365000 },
    { name: "Mexico City",    coordinates: [-99.1332,19.4326],  population: 20063000 },
    { name: "Mumbai",         coordinates: [72.8777,19.0760],   population: 17712000 },
    { name: "Osaka",          coordinates: [135.5022,34.6937],  population: 17444000 },
    { name: "Moscow",         coordinates: [37.6173,55.7558],   population: 16170000 },
    { name: "Dhaka",          coordinates: [90.4125,23.8103],   population: 15669000 },
    { name: "Greater Cairo",  coordinates: [31.2357,30.0444],   population: 15600000 },
    { name: "Los Angeles",    coordinates: [-118.2437,34.0522], population: 15058000 },
    { name: "Bangkok",        coordinates: [100.5018,13.7563],  population: 14998000 },
    { name: "Kolkata",        coordinates: [88.3639,22.5726],   population: 14667000 },
    { name: "Buenos Aires",   coordinates: [-58.3816,-34.6037], population: 14122000 },
    { name: "Tehran",         coordinates: [51.3890,35.6892],   population: 13532000 },
    { name: "Istanbul",       coordinates: [28.9784,41.0082],   population: 13287000 },
    { name: "Lagos",          coordinates: [3.3792,6.5244],     population: 13123000 },
    { name: "Shenzhen",       coordinates: [114.0579,22.5431],  population: 12084000 },
    { name: "Rio de Janeiro", coordinates: [-43.1729,-22.9068], population: 11727000 },
    { name: "Kinshasa",       coordinates: [15.2663,-4.4419],   population: 11587000 },
    { name: "Tianjin",        coordinates: [117.3616,39.3434],  population: 10920000 },
    { name: "Paris",          coordinates: [2.3522,48.8566],    population: 10858000 },
    { name: "Lima",           coordinates: [-77.0428,-12.0464], population: 10750000 },
];

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
const projection = geoEqualEarth()
    .scale(160)
    .translate([ 800 / 2, 450 / 2 ]); //Height and width
//Cite and justify

const WorldMap = () => {
    const [ geographies, setGeographies] = useState([]);
    // const [ conflictData, setConflictData ] = useState([]);

    useEffect(() => {
        setGeographies(feature(worldMapData, worldMapData.objects.countries).features);
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

    const handleCountryClick = countryIndex => {
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
                    <g className="countries">
                        {
                            geographies.map((d,i) => (
                                <path
                                    key={ `path-${ i }` }
                                    d={ geoPath().projection(projection)(d) }
                                    className="country"
                                    fill={ `rgba(255, 34, 12,${ 1 / geographies.length * i})` }
                                    onClick={ () => handleCountryClick(i) }
                                />
                            ))
                        }
                    </g>
                    <g className="markers">
                        {
                            conflictData.map((conflictEvent, index) => (
                                        <circle
                                            key={ `marker-${index}` }
                                            cx={ projection([conflictEvent.location.lng.toFixed(4), conflictEvent.location.lat.toFixed(4)])[0] }
                                            cy={ projection([conflictEvent.location.lng.toFixed(4), conflictEvent.location.lat.toFixed(4)])[1] }
                                            r={ conflictEvent.impact * -1 }
                                            className="marker"
                                            onClick={ () => handleMarkerClick(index) }
                                        />
                            ))
                        }
                    </g>
                </svg>
            </ZoomableGroup>
        </ComposableMap>
    )
};

export default WorldMap
