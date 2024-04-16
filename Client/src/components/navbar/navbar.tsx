import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './navbar.css'
import UserProfilePictureModal from '../UserProfilePcitures/UserProfilePictureModal';
import { useUser } from '../../Providers/UserProvider';
import { useAuth } from '../../Providers/AuthProvider';
import ProfileImage from './profileImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import CalendarModal from '../Modal/CalendarModal';

function Navbar() {
  const logoSrc = '/llp-logo-alpha.png'
  const { user } = useUser();
  const noUrl = !user?.profilePictureUrl;
  const auth = useAuth();
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const { signOut, isAuthenticated } = useAuth();


  const handleProfilePictureClick = async () => {
    //show UserProfilePictureModal
    setIsProfilePictureModalOpen(true);
  };

  const handleModalClose = () => {
    setIsProfilePictureModalOpen(false);
    setIsCalendarModalOpen(false);
  };

  const handleCalendarClick = () => {
    //show CalendarModal
    setIsCalendarModalOpen(true);
  }


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
      <UserProfilePictureModal currentImageUrl={noUrl ? '' : user.profilePictureUrl || ''} isOpen={isProfilePictureModalOpen} onClose={handleModalClose} />
      <CalendarModal isOpen={isCalendarModalOpen} onClose={handleModalClose} />
      <div className='navbar-navlinks-container'>
        <div className='navbar-item'>
          <img src={logoSrc} alt="logo" width={30}/>
        </div>
        
        <div className='navbar-item'>
          <NavLink to="/" className={({ isActive }) => isActive ? "selected" : ""}>Home</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/accounts" className={({ isActive }) => isActive ? "selected" : ""}>Accounts</NavLink>
        </div>
        <div className='navbar-item'>
          <NavLink to="/trial-balance" className={({ isActive }) => isActive ? "selected" : ""}>Trial Balance</NavLink>
        </div>
        { auth.isAdmin && (
          <div className='navbar-item'>
            <NavLink to="/user-management" className={({ isActive }) => isActive ? "selected" : ""}>User Management</NavLink>
          </div>
        )}
      </div>
      <div className='navbar-profile-container'>
        <div className='navbar-item cursor-pointer'>
          <FontAwesomeIcon icon={faCalendarDays} size='xl' onClick={handleCalendarClick}/>
        </div>
        {user ? <p>{user.username}</p> : <p>Loading user...</p>}

        <ProfileImage handleProfilePictureClick={handleProfilePictureClick} />
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;
