import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../Providers/UserProvider';
import { Tooltip } from '@mui/material';

interface ProfileImageProps {
  handleProfilePictureClick: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ handleProfilePictureClick }) => {
    const user = useUser();
    const noUrl = !user.user?.profilePictureUrl;

    return (
        <div>
            {noUrl ? (
                <div className='profile-circle-empty' onClick={handleProfilePictureClick}>
                    <Tooltip title='Add Profile Picture'>
                    <FontAwesomeIcon icon={faUser} />
                    </Tooltip>
                </div>
            ) : (
                <div className='profile-circle' onClick={handleProfilePictureClick}>
                    <img src={user.user?.profilePictureUrl ?? ''} alt='Profile Picture' width={50} />
                </div>
            )}
        </div>
    );
}

export default ProfileImage;