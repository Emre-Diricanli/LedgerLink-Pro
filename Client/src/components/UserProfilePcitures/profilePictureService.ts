// const API_URL = import.meta.env.VITE_LedgerLinkPro_Server_API; //TODO figure out env variables\
const API_URL = "http://localhost:7070"; //TODO figure out env variables


export const fetchSasToken = async (fileName: string): Promise<string> => {
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

export const handleFileUpload = async (selectedFile: File) => {
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
  
          const addUrlResponse = await addProfilePictureUrl(imageUrl);
          //onClose(); // Close the modal on successful upload
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
};

export const deleteProfilePicture = async () => {
    try {
        const response = await fetch(`${API_URL}/user/delete-user-profile-picture`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete profile picture');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export const addProfilePictureUrl = async (url: string) => {
    try {
        const response = await fetch(`${API_URL}/user/add-user-profile-picture-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            return false;
        }

       return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}
