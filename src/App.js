import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Reset from './pages/Reset/Reset';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import NotFound from './pages/NotFound/NotFound';
import Callback from './pages/Callback/Callback';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/analytics" element={<Analytics />} />
          {/* test for linking spotify rn */}
          <Route exact path="/callback" element={<Callback />} />
          <Route path="*" element={<NotFound />} />
        </Routes> 
      </Router>
    </div> 
  );
}

export default App;
