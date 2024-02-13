import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import '../../pages/user-management/user-management.css'
import { User, UserTableProps, SelectedUserInformationProps } from '../../components/interfaces/user-management';

const SelectedUserInfo: React.FC<SelectedUserInformationProps> = ({ selectedUser }) => {
    const [user, setUser] = useState(selectedUser);
    useEffect(() => {
        console.log('Selected User:', user);
    }, []);

        
    const formatDate = (dateString) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    return (
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
            <div className="selected-user-info-last5logins">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Login Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user && user.last5Logins.map((login, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{formatDate(login)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SelectedUserInfo;
