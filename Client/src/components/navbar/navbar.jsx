import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { get_auth_level, test_auth, user_signout_service, remove_user_info } from '../../services/auth_service';
import './navbar.css';

function Navbar() {
  const testAuth = () => {
    test_auth();
  };

  const handleSignout = async () => {
    //remove token from local storage
    localStorage.removeItem('token');
    
    //Check user role and redirect to appropriate page
    var role = await get_auth_level();

    var response = await user_signout_service();

    if (response === false) {
      console.log('signout failed');
    }

    //remove user info
    await remove_user_info();
    
    //redirect to appropriate page
    switch (role) {
      case 1:
        window.location.href = '/user-signin';
        break;
      case 2:
        window.location.href = '/user-signin';
        break;
      case 3:
        window.location.href = '/admin-signin';
        break;
      default:
        window.location.href = '/user-signin';
        break;
    }
  };
  return (
    <nav className="navbar-container">
      <div className='navbar-navlinks-container'>
        <div className='navbar-item'>
          <NavLink to="/" className={({ isActive }) => isActive ? "selected" : ""}>Home</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/user-management" className={({ isActive }) => isActive ? "selected" : ""}>User Management</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/user-signin" className={({ isActive }) => isActive ? "selected" : ""}>User Signin</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/admin-signin" className={({ isActive }) => isActive ? "selected" : ""}>Admin Signin</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/user-registration" className={({ isActive }) => isActive ? "selected" : ""}>User Signup</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/signup" className={({ isActive }) => isActive ? "selected" : ""}>Signup</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "selected" : ""}>Contact Us</NavLink>
        </div>
        <div className='navbar-item'>
          <button onClick={testAuth}>Test Auth</button>
        </div>
      </div>
      <div className='navbar-profile-container'>
        <p>ajohnson0224</p>
        <div className='profile-circle'>A</div> {/* This is a placeholder for the user's profile picture */}
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;
