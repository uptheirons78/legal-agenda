import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Clients from './components/pages/Clients';

// State
import ContactState from './context/contact/ContactState';

// Styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle';

const App = () => {
  return (
    <ContactState>
      <Router>
        <>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/about" component={About} />
              <Route exact path="/clients" component={Clients} />
            </Switch>
          </div>
        </>
      </Router>
    </ContactState>
  );
};

export default App;
