import './App.css';
import React, {useState} from "react";
import SetUpAggregator from "./SetUpAggregator";
import YourCurrentSettings from "./YourCurrentSettings";

function App() {
    return (
    <div className={'container'}>
        <SetUpAggregator />
        <YourCurrentSettings />
    </div>
  );
}

export default App;
