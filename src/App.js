import React from 'react';
import './App.css';
import Navbar from "./client/components/Navbar";
import ShowCategory from './client/Page/ShowCategory'
import ShowFruit from './client/Page/ShowFruit'
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/ShowFruit" component={ShowFruit} />
        <Route exact path="/ShowCategory" component={ShowCategory} />
      </Switch>
    </div>
  );
}

export default App;
