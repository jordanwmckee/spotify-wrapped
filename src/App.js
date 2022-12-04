import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Footer from './components/Footer';
import NotFound from './pages/NotFound.js/NotFound';

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
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes> 
          </div> 
          <Footer />
        </div>
      : <Login /> }
    </Router>
  );
}

export default App;
