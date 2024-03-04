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
import ProfileImage from './profileImage';

function Navbar() {
  const { user } = useUser();
  const noUrl = !user?.profilePictureUrl;
  const auth = useAuth();
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const { signOut, isAuthenticated } = useAuth();


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

  useEffect(() => {
    console.log('Navbar Mount')
  }, []);


  return (
    <nav className="navbar-container">
      <UserProfilePictureModal currentImageUrl={noUrl ? '' : user.profilePictureUrl || ''} isOpen={isProfilePictureModalOpen} onClose={handleModalClose} />
      <div className='navbar-navlinks-container'>
        <div className='navbar-item'>
          <NavLink to="/" className={({ isActive }) => isActive ? "selected" : ""}>Home</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/accounts" className={({ isActive }) => isActive ? "selected" : ""}>Accounts</NavLink>
        </div>
        { auth.isAdmin && (
          <div className='navbar-item'>
            <NavLink to="/user-management" className={({ isActive }) => isActive ? "selected" : ""}>User Management</NavLink>
          </div>
        )}
      </div>
      <div className='navbar-profile-container'>
        {user ? <p>{user.username}</p> : <p>Loading user...</p>}

        <ProfileImage handleProfilePictureClick={handleProfilePictureClick} />
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;
