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



    // thimgs to include in the dashboard:greeting, link to chart of accounts, payables, receivables, general ledger, the latest, reports

    return (
        <><div className='flex flex-col justify-top items-center w-full h-full'>
            <h1 className="font - serif text - x1"> Welcome{userProvider.user ? `, ${userProvider.user?.firstName}!` : '...'} </h1>
            <h2 className='mt-8'>This Dashboard is a work in progress.</h2>
        </div>
            <div className="flex flex-col justify-center items-center w-full h-full">
                <button className="absolute top-20 left-40 transform - translate-x-20 - translate-y-20 mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-20 px-20 rounded">Accounts</button>
            </div>
                {/* </><div className="flex flex-col justify-center items-center w-full h-full">
                <button className="absolute top-20 right-20 transform translate-x-20 -translate-y-20 mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-20 px-20 rounded">Reports</button>
                </div></> */}
        

            

    </>);
};

export default Dashboard;