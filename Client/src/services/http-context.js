export const http_context = async (url, options) => {
    try {
        const response = await fetch(url, options);

        return response;
    } catch (error) {
        console.log('Server Offline');
        console.error('HTTP Context Error Thrown: ', error);
        
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
        }

        throw error;
    }
};