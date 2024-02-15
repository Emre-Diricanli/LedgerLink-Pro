import React, { useState } from 'react';
import '../create-new-user/CreateNewUserModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowsRotate, faXmark } from '@fortawesome/free-solid-svg-icons';
import { addProfilePictureUrl } from '../../services/profile-picture-service';
import '../navbar/navbar.css'

interface UserProfilePictureModalProps {
    currentImageUrl: string;
    isOpen: boolean;
    onClose: () => void;
  }

  // global.d.ts
interface ImportMetaEnv {
    readonly VITE_LedgerLinkPro_Server_API: string;
    // Define other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  

const UserProfilePictureModal: React.FC<UserProfilePictureModalProps> = ({ currentImageUrl, isOpen, onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    // const API_URL = import.meta.env.VITE_LedgerLinkPro_Server_API; //TODO figure out env variables\
    const API_URL = "http://localhost:7070"; //TODO figure out env variables

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

  const fetchSasToken = async (fileName: string): Promise<string> => {
    try {
      // Replace with your backend endpoint to get a SAS token
      const response = await fetch(`${API_URL}/azureBlobService/generateSasTokenForUpload?blobName=${fileName}`);
      if (!response.ok) throw new Error('Failed to fetch SAS token');
      const data = await response.json();
      return data.sasToken; // Ensure your backend sends the SAS token in this format
    } catch (error) {
      console.error('Error fetching SAS token:', error);
      throw error;
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const sasToken = await fetchSasToken(selectedFile.name);
        const blobUrl = `https://ledgerlinkproblobstorage.blob.core.windows.net/user-profile-pictures/${selectedFile.name}${sasToken}`;
        const imageUrl = `https://ledgerlinkproblobstorage.blob.core.windows.net/user-profile-pictures/${selectedFile.name}`;
        
        const response = await fetch(blobUrl, {
          method: 'PUT',
          headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': selectedFile.type
          },
          body: selectedFile,
        });

        if (!response.ok) throw new Error('Failed to upload file');
        console.log('Upload successful');
        // Optionally, clear the selected file and preview source here
        setSelectedFile(null);
        setPreviewSrc(null);

        const addUrlResponse = await addProfilePictureUrl(imageUrl);
        //onClose(); // Close the modal on successful upload
      } catch (error) {
        console.error('Error uploading file:', error);
      }
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
            <button className="btn btn-primary" onClick={handleFileUpload}>Upload</button>
        </div>

        <div className="flex flex-row items-center justify-center gap-2 w-full pt-8">         
            <button className="modal-content-btn orange sm " onClick={() => onClose()}>Exit</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePictureModal;