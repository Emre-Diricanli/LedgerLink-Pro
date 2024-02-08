export const http_context = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if(response.status === 401){
            
            window.location.href = '/user-signin';
            console.log('401');
        }

        return response;
    } catch (error) {
        console.log('Server Offline');
        console.error('HTTP Context Error Thrown: ', error);
        throw error;
    }
};