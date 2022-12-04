import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Login';
import Dashboard from './Dashboard';
import Analytics from './Analytics';

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
      setToken(window.localStorage.getItem("token"));
  }, [token])

  return ( 
    <Router>
      { token ?
        <div className="App">
          <Navbar setToken={setToken}/>
          <div className="content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Dashboard />} />
            </Routes> 
          </div> 
        </div>
      : <Login /> }
    </Router>
  );
}

export default App;
