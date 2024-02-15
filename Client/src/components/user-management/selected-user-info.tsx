import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import '../../pages/user-management/user-management.css'
import { SelectedUserInformationProps } from '../interfaces/user-management';
import CreateUserAccecssExpirationModal from '../create-user-access-expiration/CreateUserAccessExpiration';
import { admin_delete_user_access_expiration } from '../../services/user_info_service';

const SelectedUserInfo: React.FC<SelectedUserInformationProps> = ({ selectedUser }) => {
    const [user, setUser] = useState(selectedUser);
    const [isCreateNewAccessExpirationModelOpen, setIsCreateNewAccessExpirationModelOpen] = useState(false);

    useEffect(() => {
       setUser(selectedUser);
    }, [selectedUser]);

        
    const formatDate = (dateString, showtime) => {
        if (!dateString) {
            return '';
        }

        if (showtime) {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options);
        }
    
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };
    


    const handleDeleteAccessExpiration = async (expireId) => {
        // delete access expiration
        const response = await admin_delete_user_access_expiration(expireId);

        if (response === false) {
            alert('Failed to delete access expiration');
        }
        else{
            //remove the access expiration from the user
            
            //TEMP TODO FIX THIS
            //NAVIAGTE TO THE USER PAGE
            window.location.reload();
        }
    };



    const handleModalClose = (wasSuccessful) => {
        setIsCreateNewAccessExpirationModelOpen(false);
    };

    return (
        <div>
            <CreateUserAccecssExpirationModal userId={user.userId} isOpen={isCreateNewAccessExpirationModelOpen} onClose={handleModalClose} />
            <div className="selected-user-info-container">
                <div className="selected-user-info-profile-image">
                    <img src={user.profilePictureUrl ?? 'llp-logo.png'} alt="profile" />
                </div>
                <h1 id="userFullName">
                    {user.firstName} {user.lastName}
                    {/* <span className="pencil-icon">
                        <FontAwesomeIcon icon={faPencil} size="xs" className='icon-button-link' />
                    </span> */}
                </h1>
                <div className='w-full text-center'>
                    <h3 id="userRole">{user.role}</h3>
                </div>
                <div className="user-details mt-4">
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
                
                </div>
                <div className="selected-user-info-3expirations">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user && user.userExpireAccess && user.userExpireAccess.map((accessExp, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className='flex flex-row w-full h-full justify-center items-center mt-1 mb-1'>
                                            <button onClick={() => handleDeleteAccessExpiration(accessExp.expireId)} className='icon-button danger p-0'>
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                        </div>
                                    </td>
                                    <td>{formatDate(accessExp.expireStartDate, false)}</td>
                                    <td>{formatDate(accessExp.expireEndDate, false)}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
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
                                <td>{formatDate(login, true)}</td>
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
