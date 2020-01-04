import React, { memo, useState, useEffect, Fragment } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import './WorldMap.css';

const conflictData = require("../../data/locations-2016.json").locations;

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const titleCase = string => {
    return string.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
};

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

    const handleCountryClick = (geographies, countryIndex) => {
        //TODO Add ref to display content for country click and marker click
        console.log("Clicked on country: ", geographies[countryIndex])
    };

    const handleMarkerClick = i => {
        console.log("Marker: ", conflictData[i].location.fullName)
    };

    const countryProtests = countryName => {
        return conflictData.filter(country =>
            country.protestLocation.country && countryName.trim().includes(country.protestLocation.country.trim())
        ).length;
    };

    //Include Greticule?
    return (
        <Fragment>
            <ComposableMap data-tip={""} data-for="countryTooltip" className="mapContainer">
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
                                        onMouseEnter={() => {
                                            let countryTooltip = (
                                                <span className="countryTooltipBox">
                                                    Protests in {geo.properties.NAME} in {year} : {countryProtests(geo.properties.NAME)}
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
                                    r={5}
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
