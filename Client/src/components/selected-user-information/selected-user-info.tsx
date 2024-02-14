import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import '../../pages/user-management/user-management.css'
import { User, UserTableProps, SelectedUserInformationProps } from '../../components/interfaces/user-management';
import CreateUserAccecssExpirationModal from '../create-user-access-expiration/CreateUserAccessExpiration';

const SelectedUserInfo: React.FC<SelectedUserInformationProps> = ({ selectedUser }) => {
    const [user, setUser] = useState(selectedUser);
    const [isCreateNewAccessExpirationModelOpen, setIsCreateNewAccessExpirationModelOpen] = useState(false);

    useEffect(() => {
       setUser(selectedUser);
    }, [selectedUser]);

        
    const formatDate = (dateInput) => {
        if (typeof dateInput !== 'string') {
            console.error('formatDate expects a string input', dateInput);
            return 'Invalid Input'; // Fallback message or handling
        }
    
        const isoFormattedString = dateInput.replace(' ', 'T');
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', // Correct type
            month: 'short', // Correct type
            day: 'numeric', // Correct type
            hour: '2-digit', // Correct type
            minute: '2-digit', // Correct type
            second: '2-digit', // Correct type
            timeZoneName: 'short' // Correct type
        };
        const date = new Date(isoFormattedString);
    
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
    
        // Combine date and time into a single string properly
        return `${date.toLocaleDateString('en-US', options)} ${date.toLocaleTimeString('en-US', options)}`;
    };
    
    
    

    const handleCreateNewAccessExpiration = () => {
        
    }

    const handleModalClose = (wasSuccessful) => {
        setIsCreateNewAccessExpirationModelOpen(false);
        // if (wasSuccessful) {
        //     setHasFetchedUsers(false);

        //     setTimeout(() => {
        //         setHasFetchedUsers(true);
        //     }, 0);
        // } 
    };

    return (
        <div>
            <CreateUserAccecssExpirationModal userId={user.userId} isOpen={isCreateNewAccessExpirationModelOpen} onClose={handleModalClose} />
            <div className="selected-user-info-container">
                <div className="selected-user-info-profile-image">
                    <img src="https://via.placeholder.com/150" alt="profile" />
                </div>
                <h1 id="userFullName">
                    {user.firstName} {user.lastName}
                    <span className="pencil-icon">
                        <FontAwesomeIcon icon={faPencil} size="xs" className='icon-button-link' />
                    </span>
                </h1>
                <h3 id="userRole">{user.role}</h3>
                <div className="user-details">
                    <p id="username">Username: {user.username}</p>
                    <p id="emailStatus" style={{ color: user.confirmedEmail ? 'green' : 'red' }}>Email Confirmed: {user.confirmedEmail ? 'Yes' : 'No'}</p>
                    <p id="accountStatus">Account Status: {user.isActive ? 'Yes' : 'No'}</p>
                    <p id="phonenumber">{user.phoneNumber}</p>
                    <p id="address">Address: {user.streetAddress}, {user.city}, {user.state}, {user.zipCode}</p>
                </div>
                <div className='flex flex-col content-start justify-start w-full mt-4'>
                    <div className='flex flex-row w-full justify-between items-center p-4'>
                        <h2>Access Expirations</h2>
                        <button className='' onClick={() => setIsCreateNewAccessExpirationModelOpen(true)}>Create New</button>
                    </div>
                    <div className="selected-user-info-last5logins">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Last 3 Access Expirations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user && user.userExpireAccess && user.userExpireAccess.map((login, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(login.expireStartDate)}</td> {/* Adjusted to pass the correct property */}
                                    <td>{formatDate(login.expireEndDate)}</td> {/* Example for end date if needed */}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                </div>
                <div className="selected-user-info-last5logins">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Last 5 Logins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user && user.last5Logins && user.last5Logins.map((login, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(login)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SelectedUserInfo;
