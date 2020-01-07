import React, { memo, useState, useEffect, Fragment } from "react";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
// import { Spring, config } from "react-spring";
import ReactTooltip from "react-tooltip";
// import StateMap from "./StateMap";
import './WorldMap.css';
import {transform} from "topojson-client";

const countryCount = require("../../data/countryCount-2016-test.json");
const conflictData = require("../../data/locations-2016-test.json").locations;

const indiaMap = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";
// const indiaMap = require("../../data/india-states");
const stateMap = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-districts.json";
    // require("../../data/india-districts");
    // "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const titleCase = string => {
    return string.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
};

const colorScale = scaleLinear()
    .domain([0, 13311]) // TODO Change to dynamic
    .range(["#ffedea", "#ff5233"]);

const WorldMap = () => {
    // const [ conflictData, setConflictData ] = useState([]);
    const [countryContent, setCountryContent] = useState("");
    const [conflictContent, setConflictContent] = useState("");
    const [year, setYear] = useState("");
    const [view, setView] = useState("country");
    const [map, setMap] = useState(indiaMap);
    const [states, setStates] = useState("");
    const [transforms, setTransforms] = useState({scale: 800, center: [80,22], zoom: 1, width: 800});
    // const [scale, setScale] = useState(800);
    // const [center, setCenter] = useState([80,22]);
    // const [zoom, setZoom] = useState(1);


    useEffect(() => {
        setYear(conflictData[0].year);
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

    const handleStateClick = (geographies) => {
        console.log("Clicked on country: ", geographies);
        setStates(geographies.properties.NAME_1);
        setMap(stateMap);
        setView("state");
        setTransforms({
            scale: 2200, center: [78, 22], width: 1000,
            // scale: 800,
            // width: 800,
            // center: [80,22],
            // zoom: 6
        });
    };

    const handleMarkerClick = (conflictEvent, i) => {
        console.log("Marker: ", conflictEvent)
    };

    const countryProtests = countryName => {
        return conflictData.filter(country =>
            country.protestLocation.country && countryName.trim().includes(country.protestLocation.country.trim())
        ).length;
    };

    const stateFill = stateName => {
        let state = Object.keys(countryCount).find((state => stateName === state));
        return state ? colorScale(countryCount[state]) : "#F5F4F6";
    };

    const bubbleSize = conflictEvent => {
        return 5 + conflictData.filter(conflict => (
            conflict.protestLocation && conflictEvent.protestLocation ? (
                conflict.protestLocation.lat.toFixed(0) === conflictEvent.protestLocation.lat.toFixed(0) &&
                conflict.protestLocation.lng.toFixed(0) === conflictEvent.protestLocation.lng.toFixed(0)
            )
                : 0
        )).length/5
    };

    //Include Greticule?
    return (
        <Fragment>
                <ComposableMap data-tip={""} data-for="countryTooltip" className="mapContainer"
                               width={transforms.width}
                           height={400}
                           projection="geoAzimuthalEqualArea"
                           projectionConfig={{
                               rotate: [-70.0, -22.0, 0],
                               scale: transforms.scale
                           }}
                >
                <ZoomableGroup zoom={transforms.zoom} center={transforms.center}>
                    <svg className="worldMap">
                        {/*{view === "country" ?*/}
                            (<Geographies className="countries" geography={map}>
                                {({geographies}) =>
                                    geographies
                                        .filter((geography) => {
                                            if(view === "state") {
                                                return geography.properties.NAME_1 === states;
                                            }
                                            return true;
                                        })
                                        .map((geo, i) =>
                                            <Geography
                                                className="country"
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill={stateFill(geo.properties.NAME_1)}
                                                onClick={() => handleStateClick(geo, i)}
                                                onMouseEnter={() => {
                                                    let countryTooltip = (
                                                        <span className="countryTooltipBox">
                                                    Protests in {geo.properties.NAME_1} in {year} :
                                                            {countryProtests(geo.properties.NAME_1)}
                                                </span>
                                                    );
                                                    setCountryContent(countryTooltip);
                                                }}
                                                onMouseLeave={() => {
                                                    setCountryContent(false);
                                                }}
                                            />
                                        )
                                }
                            </Geographies>
                            {/*// ):*/}
                            {/*// (<StateMap stateName={states}/>)*/}
                        }
                        {conflictData
                            .filter((conflictEvent) => {
                                if(view === "country") {
                                    return conflictEvent.protestLocation &&
                                        conflictEvent.protestLocation.country === "India"
                                } else {
                                    return states === conflictEvent.protestLocation.state;
                                }

                            })
                            .map((conflictEvent, index) => (
                            <Marker
                                className="markers"
                                coordinates={[
                                    conflictEvent.protestLocation.lng.toFixed(4),
                                    conflictEvent.protestLocation.lat.toFixed(4)
                                ]}
                                data-tip
                                data-for="protestTooltip"
                                key={ `marker-${index}` }
                                onMouseEnter={() => {
                                    let conflictTooltip = (
                                        <span className="conflictTooltipBox">
                                            <b>Location:</b> {conflictEvent.protestLocation.city}{", "}
                                            {conflictEvent.protestLocation.country}<br />
                                            <b>Date:</b> {new Date(conflictEvent.date).toDateString()}<br />
                                            {conflictEvent.protestCause !== "Undefined" && (
                                                <Fragment><b>Protest Cause:</b>{titleCase(conflictEvent.protestCause)}
                                                <br /></Fragment>)}
                                            <b>Protest Type:</b> {titleCase(conflictEvent.protestType)}<br />
                                            <b>Read more at:</b><br />
                                            {conflictEvent.sources.map((source, index) =>
                                                (<Fragment key={source.sourceUrl}>
                                                    <a className="source" href={source.sourceUrl}>Source {index + 1}</a><br />
                                                </Fragment>)
                                            )}
                                        </span>
                                    );
                                    setConflictContent(conflictTooltip);
                                }}
                                // onMouseLeave={() => {
                                //     setConflictContent("");
                                // }}
                                    >
                                <circle
                                    className="marker"
                                    r={ bubbleSize(conflictEvent) }
                                    onClick={ () => handleMarkerClick(conflictEvent, index) }
                                />
                            </Marker>
                        ))}
                    </svg>
                </ZoomableGroup>
            </ComposableMap>)
            }
            {countryContent && (<ReactTooltip id="countryTooltip">
                { countryContent }
            </ReactTooltip>)}
            {conflictContent && (
                <ReactTooltip id="protestTooltip" delayHide={200} className="protestTooltip" effect='solid'>
                { conflictContent }
            </ReactTooltip>)}
        </Fragment>
    )
};

export default memo(WorldMap)
