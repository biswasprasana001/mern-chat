import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app__body">
          <Sidebar />
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
