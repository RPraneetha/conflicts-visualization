import React from 'react';
import './App.css';
import WorldMap from "./world-map/WorldMap";

class App extends React.Component {

  componentDidMount() {

  }

  render() {
      return (
            <div className="App">
                <WorldMap/>
            </div>
    );
  }
}
export default App;
