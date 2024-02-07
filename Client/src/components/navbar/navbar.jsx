import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { test_auth } from '../../services/auth_service';
import './navbar.css';

function Navbar() {
  const testAuth = () => {
    test_auth();
  };
  return (
    <nav className="navbar-container">
      <div className='navbar-navlinks-container'>
        <div className='navbar-item'>
          <NavLink to="/" className={({ isActive }) => isActive ? "selected" : ""}>Home</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/about" className={({ isActive }) => isActive ? "selected" : ""}>User Management</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "selected" : ""}>Other</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/user-signin" className={({ isActive }) => isActive ? "selected" : ""}>User Signin</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/admin-signin" className={({ isActive }) => isActive ? "selected" : ""}>Admin Signin</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/signup" className={({ isActive }) => isActive ? "selected" : ""}>Signup</NavLink>
        </div>
        <div className='navbar-item'>
          <button onClick={testAuth}>Test Auth</button>
        </div>
      </div>
      <div className='navbar-profile-container'>
        <p>ajohnson0224</p>
        <div className='profile-circle'>A</div> {/* This is a placeholder for the user's profile picture */}
      </div>
    </nav>
  );
}

export default Navbar;
