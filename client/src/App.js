import React, { useEffect } from 'react'; // Import useEffect from React
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import io from 'socket.io-client';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Emit a login event with the user's ID when they log in
    socket.emit('login', userId); // Replace userId with the actual user ID

    return () => {
      socket.disconnect();
    };
  }, [userId]); // Add userId as a dependency

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
