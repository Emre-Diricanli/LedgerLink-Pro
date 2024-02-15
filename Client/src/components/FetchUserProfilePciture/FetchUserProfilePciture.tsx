import { useEffect, useState } from 'react';
import { getProfilePictureUrl } from '../../services/profile-picture-service';


export function useProfilePicture(isAuthenticated?: boolean) {
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [noUrl, setNoUrl] = useState(false);

    // useEffect(() => {
    //   if (!isAuthenticated) return; // Exit if not authenticated
  
    //   // Your existing logic to fetch the profile picture
    // }, [isAuthenticated]); // Depend on isAuthenticated
  
    useEffect(() => {
      if (!isAuthenticated) return; // Exit if not authenticated

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
    }, [isAuthenticated]);
  
    return { profilePictureUrl, noUrl };
  }