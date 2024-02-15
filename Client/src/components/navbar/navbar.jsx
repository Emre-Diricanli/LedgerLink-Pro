import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { get_auth_level, test_auth, user_signout_service, remove_user_info } from '../../services/auth_service';
import './navbar.css'
import UserProfilePictureModal from '../user-profile-picture-modal/UserProfilePictureModal';
import { getProfilePictureUrl } from '../../services/profile-picture-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../util/UserProvider';

function Navbar() {
  const {user, fetchUser } = useUser();
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [noUrl, setNoUrl] = useState(false);

  useEffect(() => {
    // Function to fetch the profile picture URL
    const fetchProfilePictureUrl = async () => {
      const response = await getProfilePictureUrl();

      if (response === false) {
        console.log('Failed to fetch profile picture URL');
        setNoUrl(true);
        return;
      } else {
        setNoUrl(false);
        setProfilePictureUrl(response);
      }
    };

    fetchProfilePictureUrl();
  }, []);
  

  const handleProfilePictureClick = async () => {
    //show UserProfilePictureModal
    setIsProfilePictureModalOpen(true);
  };

  const handleModalClose = () => {
    setIsProfilePictureModalOpen(false);
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
      <UserProfilePictureModal currentImageUrl={noUrl ? '' : profilePictureUrl} isOpen={isProfilePictureModalOpen} onClose={handleModalClose} />
      <div className='navbar-navlinks-container'>
        <div className='navbar-item'>
          <NavLink to="/" className={({ isActive }) => isActive ? "selected" : ""}>Home</NavLink>
        </div>
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
