import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Dashboard from './pages/dashboard/dashboard';
import UserSignin from './pages/signin-signup/user-signin';

function App() {
  // This component will determine whether to show the Navbar
  const Layout = ({ children }) => {
    const location = useLocation(); // Get the current location
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
      setShowNavbar(location.pathname !== "/user-signin" && location.pathname !== "/admin-signin");
    }, [location]);

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
      </Routes>
    </Router>
  );
}

export default App;