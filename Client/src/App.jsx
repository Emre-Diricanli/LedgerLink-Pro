import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Dashboard from './pages/dashboard/dashboard';
import UserSignin from './pages/signin-signup/user-signin';
import AdminSignin from './pages/signin-signup/admin-signin';
import AdminConfirmEmail from './pages/confirm-email/admin-confirm-email';

function App() {
  // This component will determine whether to show the Navbar
  const Layout = ({ children }) => {
    const location = useLocation(); // Get the current location
    const [showNavbar, setShowNavbar] = useState(true);
    const [noShowNavbarLocations, setNoShowNavbarLocations] = useState(["/user-signin", "/admin-signin", "/admin-confirm-email"]);

    
    useEffect(() => {
      setShowNavbar(!noShowNavbarLocations.includes(location.pathname));
    }, [location, noShowNavbarLocations]);

    return (
      <div className='App'>
        {showNavbar && <Navbar />}
        {children}
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/user-signin" element={<Layout><UserSignin /></Layout>} />
        <Route path="/admin-signin" element={<Layout><AdminSignin /></Layout>} />
        <Route path="/admin-confirm-email" element={<Layout><AdminConfirmEmail /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;