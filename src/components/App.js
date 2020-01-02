import React, { useState } from 'react';
import ReactTooltip from "react-tooltip";
import WorldMap from "./world-map/WorldMap";
import './App.css';

function App() {
  const [content, setContent] = useState("");
  console.log(content)
  return (
        <div className="App">
            <WorldMap setTooltipContent={setContent}/>
            <ReactTooltip>{content}</ReactTooltip>
        </div>
);
}
export default App;
