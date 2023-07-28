import React, { useEffect } from 'react'; // Import useEffect from React
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Emit a login event with the user's ID when they log in
    const userId = '123456789'; // Replace with the actual user ID or a dummy one for testing
    socket.emit('login', userId);

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
