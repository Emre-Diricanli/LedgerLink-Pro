import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './navbar.css'
import UserProfilePictureModal from '../UserProfilePcitures/UserProfilePictureModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../util/UserProvider';
import { useProfilePicture } from '../UserProfilePcitures/FetchUserProfilePciture';
import { redirectBasedOnValue } from '../DeterminRedirectPath/DeterminRedirectPath';
import { useAuth } from '../../util/AuthenticationManagement';

function Navbar() {
  const { user } = useUser();
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const { signOut, isAuthenticated } = useAuth();
  const { profilePictureUrl, noUrl } = useProfilePicture(isAuthenticated);


  const handleProfilePictureClick = async () => {
    //show UserProfilePictureModal
    setIsProfilePictureModalOpen(true);
  };

  const handleModalClose = () => {
    setIsProfilePictureModalOpen(false);
  };

  const handleSignout = async () => {
    try {
      await signOut(); // Call the signOut method from AuthContext
      // navigate('/signin'); // Redirect user to the sign-in page or another appropriate page
    } catch (error) {
      console.error('Sign-out failed:', error);
      alert('Sign-out failed');
    }
  };


  return (
    <nav className="navbar-container">
      <UserProfilePictureModal currentImageUrl={noUrl ? '' : profilePictureUrl} isOpen={isProfilePictureModalOpen} onClose={handleModalClose} />
      <div className='navbar-navlinks-container'>
        <div className='navbar-item'>
          <NavLink to="/" className={({ isActive }) => isActive ? "selected" : ""}>Home</NavLink>
        </div>
        {/* { user.role === 'admin' ? 
        <div className='navbar-item'>
          <NavLink to="/user-management" className={({ isActive }) => isActive ? "selected" : ""}>User Management</NavLink>
        </div> : <></>
        } */}
        <div className='navbar-item'>
          <NavLink to="/user-management" className={({ isActive }) => isActive ? "selected" : ""}>User Management</NavLink>
        </div>
      </div>
      <div className='navbar-profile-container'>
        {user ? <p>{user.username}</p> : <p>Loading user...</p>}

        {noUrl ? (
          <div className='profile-circle-empty' onClick={handleProfilePictureClick}>
            <FontAwesomeIcon icon={faUser} />
          </div>
        ) : (
          <div className='profile-circle' onClick={handleProfilePictureClick}>
            <img src={profilePictureUrl} alt='Profile Picture' width={50} />
          </div>
        )}
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;