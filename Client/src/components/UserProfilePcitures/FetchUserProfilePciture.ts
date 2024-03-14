import { useEffect, useState } from 'react';
import { GetProfilePictureUrl } from './profilePictureService';
import { useSystems } from '../../Providers/SystemsProvider';


export function useProfilePicture() {
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [noUrl, setNoUrl] = useState(false);
    const systemsProvider = useSystems();

    useEffect(() => {
      const fetchProfilePictureUrl = async () => {
        try {
          const response = await GetProfilePictureUrl(systemsProvider.apiUrl);
          if (!response) throw new Error('No profile picture URL');
          setProfilePictureUrl(response);
          setNoUrl(false);
        } catch (error) {
          console.error((error as Error).message);
          setNoUrl(true);
        }
      };
  
      fetchProfilePictureUrl();
    }, []);
  
    return { profilePictureUrl, noUrl };
  }