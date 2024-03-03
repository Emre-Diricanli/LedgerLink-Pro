const API_URL = import.meta.env.VITE_LedgerLinkPro_Server_API;
import { http_context } from './http-context.js';

export const getProfilePictureUrl = async () => {
    try {
        const response = await http_context(`${API_URL}/user/profile-picture-url`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        const url = data.url;
        return url;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}

export const addProfilePictureUrl = async (url) => {
    try {
        const response = await http_context(`${API_URL}/user/add-user-profile-picture-url`, {
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



// export const fetchSasToken = async (fileName) => {
//     try {
//       // Replace with your backend endpoint to get a SAS token
//       const response = await fetch(`${API_URL}/azureBlobService/generateSasTokenForUpload?blobName=${fileName}`);
//       if (!response.ok) throw new Error('Failed to fetch SAS token');
//       const data = await response.json();
//       return data.sasToken; // Ensure your backend sends the SAS token in this format
//     } catch (error) {
//       console.error('Error fetching SAS token:', error);
//       throw error;
//     }
//   }; 

//   export const handleFileUpload = async () => {
//     if (selectedFile) {
//       try {
//         const sasToken = await fetchSasToken(selectedFile.name);
//         const blobUrl = `https://ledgerlinkproblobstorage.blob.core.windows.net/user-profile-pictures/${selectedFile.name}?${sasToken}`;
        
//         const response = await fetch(blobUrl, {
//           method: 'PUT',
//           headers: {
//             'x-ms-blob-type': 'BlockBlob',
//             'Content-Type': selectedFile.type
//           },
//           body: selectedFile,
//         });

//         if (!response.ok) throw new Error('Failed to upload file');

        


       
       
       
//       } catch (error) {
//         console.error('Error uploading file:', error);
//       }
//     }
//   };