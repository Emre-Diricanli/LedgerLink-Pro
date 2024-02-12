import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Dashboard from './pages/dashboard/dashboard';
import UserSignin from './pages/signin-signup/user-signin';
import AdminSignin from './pages/signin-signup/admin-signin';
import UserRegistration from './pages/signin-signup/user-registration';
import AdminConfirmEmail from './pages/confirm-email/admin-confirm-email';
import UserManagement from './pages/user-management/user-mangement';
import ConfirmUser from './pages/confirm-user/confirm-user';
import NewUserResetPassword from './pages/new-user/new-user-reset-password';
import AdminSignup from './pages/signin-signup/admin-signup';
import ServerOfflinePage from './pages/server-offline/server-offline';

function App() {
  // This component will determine whether to show the Navbar
  const Layout = ({ children }) => {
    const location = useLocation(); // Get the current location
    const [showNavbar, setShowNavbar] = useState(true);
    const [noShowNavbarLocations, setNoShowNavbarLocations] = useState(["/user-signin", "/admin-signin", "/admin-confirm-email", "/user-signup", '/user-registration', '/confirm-user','/new-user/reset-password', '/admin-signup', '/server-offline']);

    
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
        <Route path="/admin-signup" element={<Layout><AdminSignup /></Layout>} />
        <Route path="/user-registration" element={<Layout><UserRegistration /></Layout>} />
        <Route path="/admin-confirm-email" element={<Layout><AdminConfirmEmail /></Layout>} />
        <Route path="/confirm-user" element={<Layout><ConfirmUser /></Layout>} />
        <Route path="/new-user/reset-password" element={<Layout><NewUserResetPassword /></Layout>} />
        <Route path="/user-management" element={<Layout><UserManagement /></Layout>} />
        <Route path="/server-offline" element={<Layout><ServerOfflinePage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;