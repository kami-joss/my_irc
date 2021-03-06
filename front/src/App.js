import './App.css';
import Accueil from './components/Accueil';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { io } from "socket.io-client";
import Channel from './components/Channel';

const ENDPOINT = "http://127.0.0.1:3000";

function App() {
  const socket = io(ENDPOINT);

  const [response, setResponse] = useState("");
  
  useEffect(() => {
    socket.on("message", data => {
      setResponse(data);
      console.log(data);
    });
    socket.on('joinChannel', (data) => {
      console.log('join')
  })
  }, []);

  return (
      <Router>
        <Switch>
          <Route path="/:channel/:username"> 
            <Channel />
          </Route>
          <Route path="/"> 
            <Accueil />
          </Route> 
      </Switch>
    </Router>
  );
}

export default App;
