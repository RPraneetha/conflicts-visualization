import React, { memo, useState, useEffect, Fragment } from "react";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import './WorldMap.css';

const countryCount = require("../../data/countryCount2019.json");
const conflictData = require("../../data/locations-2019.json").locations;

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

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

    const handleCountryClick = (geographies) => {
        console.log("Clicked on country: ", geographies.properties.NAME)
    };

    const handleMarkerClick = i => {
        console.log("Marker: ", conflictData[i].protestLocation.city)
    };

    const countryProtests = countryName => {
        return conflictData.filter(country =>
            country.protestLocation.country && countryName.trim().includes(country.protestLocation.country.trim())
        ).length;
    };

    const countryFill = countryName => {
        let country = Object.keys(countryCount).find((country => countryName.includes(country)));
        return country ? colorScale(countryCount[country]) : "#F5F4F6";
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
            <ComposableMap data-tip={""} data-for="countryTooltip" className="mapContainer" width={1000} height={500}>
                <ZoomableGroup zoom={1}>
                    <svg className="worldMap">
                        <Geographies className="countries" geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo, i) =>
                                    <Geography
                                        className="country"
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={ countryFill(geo.properties.NAME) }
                                        onClick={ () => handleCountryClick(geo, i) }
                                        onMouseEnter={() => {
                                            let countryTooltip = (
                                                <span className="countryTooltipBox">
                                                    Protests in { geo.properties.NAME } in { year } : { countryProtests(geo.properties.NAME) }
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
                        {conflictData.map((conflictEvent, index) => (
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
                                            <b>Location:</b> {conflictEvent.protestLocation.city}{", "}{conflictEvent.protestLocation.country}<br />
                                            <b>Date:</b> {new Date(conflictEvent.date).toDateString()}<br />
                                            {conflictEvent.protestCause !== "Undefined" && (
                                                <Fragment><b>Protest Cause:</b>{titleCase(conflictEvent.protestCause)}<br /></Fragment>)}
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
                                    onClick={ () => handleMarkerClick(index) }
                                />
                            </Marker>
                        ))}
                    </svg>
                </ZoomableGroup>
            </ComposableMap>
            {countryContent && (<ReactTooltip id="countryTooltip">
                { countryContent }
            </ReactTooltip>)}
            {conflictContent && (<ReactTooltip id="protestTooltip" delayHide={200} className="protestTooltip" effect='solid'>
                { conflictContent }
            </ReactTooltip>)}
        </Fragment>
    )
};

export default memo(WorldMap)
