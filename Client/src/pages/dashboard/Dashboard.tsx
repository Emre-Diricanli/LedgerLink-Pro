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
        <>
            <div className='flex flex-col justify-top items-center w-full h-full'>
                <h1 className="font-serif text-x1">LedgerLink PRO</h1>
                <h2 className="font-serif text-x1">Welcome {userProvider.user ? `, ${userProvider.user?.firstName}!` : '...'} </h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="flex justify-center">
                    <button className="m-4 p-8 bg-blue-500 text-white rounded" onClick={() => console.log("Button 1 clicked")}>Accounts</button>
                    <button className="m-4 p-10 bg-blue-500 text-white rounded" onClick={() => console.log("Button 2 clicked")}>Profile</button>
                    <button className="m-4 p-8 bg-blue-500 text-white rounded" onClick={() => console.log("Button 3 clicked")}>Sign Out</button>
                </div>
            </div>
        </>
    );
};

export default Dashboard;