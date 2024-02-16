import React, { useState } from 'react';
import '../create-new-user/CreateNewUserModal.css';
import '../navbar/navbar.css'
import {handleFileUpload } from './profilePictureService'

interface UserProfilePictureModalProps {
    currentImageUrl: string;
    isOpen: boolean;
    onClose: () => void;
  }

const UserProfilePictureModal: React.FC<UserProfilePictureModalProps> = ({ currentImageUrl, isOpen, onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);

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

  const uploadFile = async () => {
    if (selectedFile) {
        await handleFileUpload(selectedFile);
        // handleFileUpload could internally call `setPreviewSrc(null)` and `onClose()` after a successful upload
    }
};
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => onClose()}>
      <div className="modal-content" onClick={handleModalClick}>
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
            <input type="file" onChange={handleFileChange} />
            <button className="btn btn-primary" onClick={uploadFile}>Upload</button>
        </div>

        <div className="flex flex-row items-center justify-center gap-2 w-full pt-8">         
            <button className="modal-content-btn orange sm " onClick={() => onClose()}>Exit</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePictureModal;