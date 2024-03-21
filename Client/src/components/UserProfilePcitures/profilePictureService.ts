
export const HandleFileUpload = async (selectedFile: File, apiUrl : string) : Promise<boolean> => {
    if (selectedFile) {
        try {
            const fileName = encodeURIComponent(selectedFile.name); // Encode the file name
          const sasToken = await FetchSasToken(selectedFile.name, apiUrl);
          const blobUrl = `https://ledgerlinkproblobstorage.blob.core.windows.net/user-profile-pictures/${fileName }${sasToken}`;
          const imageUrl = `https://ledgerlinkproblobstorage.blob.core.windows.net/user-profile-pictures/${fileName }`;
          
          const response = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
              'x-ms-blob-type': 'BlockBlob',
              'Content-Type': selectedFile.type
            },
            body: selectedFile,
          });
  
          if (!response.ok) {
            return false;
          };
          console.log('Upload successful');
  
          const addUrlResponse = await AddProfilePictureUrl(imageUrl, apiUrl);
          //onClose(); // Close the modal on successful upload
          return addUrlResponse;
        } catch (error) {
            console.error('Error uploading file:', error);
            return false;
        }
      } else {
        return false;
      }
};

export const FetchSasToken = async (fileName: string, apiUrl : string): Promise<string> => {
    try {
        // Replace with your backend endpoint to get a SAS token
        const response = await fetch(`${apiUrl}/azureBlobService/generateSasTokenForUpload?blobName=${fileName}`);
        if (!response.ok) throw new Error('Failed to fetch SAS token');
        const data = await response.json();
        return data.sasToken; // Ensure your backend sends the SAS token in this format
      } catch (error) {
        console.error('Error fetching SAS token:', error);
        throw error;
      }
};

export const DeleteProfilePicture = async (currentImageUrl : string, apiUrl : string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/delete-user-profile-picture`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(currentImageUrl)
        });

        if (!response.ok) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
};

export const AddProfilePictureUrl = async (url: string, apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/add-user-profile-picture-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(url)
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

export const GetProfilePictureUrl = async (apiUrl : string) => {
    try {
        const response = await fetch(`${apiUrl}/user/profile-picture-url`, {
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
