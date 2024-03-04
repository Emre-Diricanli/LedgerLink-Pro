import { useEffect, useState } from 'react';
import { getProfilePictureUrl } from '../../services/profile-picture-service';


export function useProfilePicture() {
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [noUrl, setNoUrl] = useState(false);

    useEffect(() => {
      const fetchProfilePictureUrl = async () => {
        try {
          const response = await getProfilePictureUrl();
          if (!response) throw new Error('No profile picture URL');
          setProfilePictureUrl(response);
          setNoUrl(false);
        } catch (error) {
          console.error(error.message);
          setNoUrl(true);
        }
      };
  
      fetchProfilePictureUrl();
    }, []);
  
    return { profilePictureUrl, noUrl };
  }