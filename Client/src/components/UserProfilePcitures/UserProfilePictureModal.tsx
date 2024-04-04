import React, { useState } from 'react';
import '../create-new-user/CreateNewUserModal.css';
import '../navbar/navbar.css'
import { DeleteProfilePicture, HandleFileUpload } from './profilePictureService'
import { useSystems } from '../../Providers/SystemsProvider';
import './UserProfilePictureModal.css';
import { useUser } from '../../Providers/UserProvider';
import { Tooltip } from '@mui/material';

interface UserProfilePictureModalProps {
  currentImageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfilePictureModal: React.FC<UserProfilePictureModalProps> = ({ currentImageUrl, isOpen, onClose }) => {
    if (!isOpen) return null;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const systemsProvider = useSystems();
    const userProvider = useUser();

  const handleModalClick = (event: React.MouseEvent) => {
      event.stopPropagation();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const HandleFileDelete = async () => {
    // Call the delete function from profilePictureService
      if (currentImageUrl !== '') {
          const deleteResponse = await DeleteProfilePicture(currentImageUrl, systemsProvider.apiUrl);

          if (deleteResponse) {
              userProvider.user && (userProvider.user.profilePictureUrl = '');
              setPreviewSrc(null);
              onClose();
          } else {
            alert('There was a problem deleting the file');
          }
      }
  };

  const uploadFile = async () => {
    if (selectedFile) {
        const uploadResult = await HandleFileUpload(selectedFile, systemsProvider.apiUrl);

        if (uploadResult){
            onClose();
        }
    }
};

  return (
    <div className="modal-backdrop" onClick={() => onClose()}>
      <div className="modal-content" onClick={handleModalClick}>
        <div className='modal-body'>
          <div className="flex flex-row items-center justify-center gap-2 w-full pb-8">         
              <h1>User Profile Picture</h1>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 w-full pb-8">         
              <img 
                  src={currentImageUrl === '' ? (previewSrc || "https://www.w3schools.com/howto/img_avatar.png") : currentImageUrl} 
                  alt="Avatar" 
                  className="profile-circle-large" 
                  width={200}
                  />
          </div>

          <div className="flex flex-row items-center justify-center gap-2 w-full pb-8">
             
             <div className='mr-auto'>
                <input type="file" id="file-input" name="file-input" onChange={handleFileChange}/>

                <label id="file-input-label" htmlFor="file-input">
                  Select a File
                </label>
             </div>
              {currentImageUrl !== '' && (
                <Tooltip title='Delete Profile Picture'>
                <button className="btn danger" onClick={HandleFileDelete}>Delete</button>
                </Tooltip>
              )}
              <Tooltip title='Upload Profile Picture'>
              <button className="btn btn-primary" onClick={uploadFile}>Upload</button>
              </Tooltip>
          </div>

          <div className="flex flex-row items-center justify-center gap-2 w-full pt-8">   
          <Tooltip title='Exit'>      
              <button className="modal-content-btn orange sm " onClick={() => onClose()}>Exit</button>
          </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePictureModal;