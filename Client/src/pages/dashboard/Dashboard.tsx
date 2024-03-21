import { useUser } from '../../Providers/UserProvider';

const Dashboard = () => {
    const userProvider = useUser();

    // useEffect(() => {
    //     //verify role status
    //     const verifyRoleStatus = async () => {
    //         try {
    //             // Call the auth_service API to get the auth level
    //             const authLevel = await auth.HandleGetRole();

    //         } catch (error) {
    //             // Handle any errors that occurred during the API call
    //             console.error('Error:', error);
    //         }
    //     };

    //     verifyRoleStatus();
    // }, []);

    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <h1>Welcome{userProvider.user ? `, ${userProvider.user?.firstName}!` : '...'} </h1>
            <h2 className='mt-8'>This Dashboard is a work in progress.</h2>
        </div>
    );
};

export default Dashboard;