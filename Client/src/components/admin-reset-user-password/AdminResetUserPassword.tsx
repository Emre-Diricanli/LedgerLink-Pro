import React, { useState, useEffect } from 'react';
import '../create-new-user/CreateNewUserModal.css';
import { AdminResetUserPassword } from '../../services/UserService';
import { useSystems } from '../../Providers/SystemsProvider';

interface AdminUserResetPasswordModalProps {
  userId: string;
  isOpen: boolean;
  onClose: (arg0: boolean) => void;
}

const AdminResetUserPasswordModal: React.FC<AdminUserResetPasswordModalProps> = ({ userId, isOpen, onClose }) => {
  const [yesToReset, setYesToReset] = useState(false);
  const systemsProvider = useSystems();

    const [expirePassword, setExpirePassword] = useState<boolean>(true);

    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [defaultPassword, setDefaultPassword] = React.useState('Password123$'); // This is the default password for the user, which is generated when the user is created
    const [isntCustomPassword, setIsntCustomPassword] = React.useState(true);
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        number: false,
        uppercase: false,
        specialChar: false,
        passwordsMatch: false,
    });

    const updatePasswordRequirements = (password : string) => {

        //if password is empty, set all requirements to false
        if (password === '') {
            setPasswordRequirements({
                minLength: false,
                number: false,
                uppercase: false,
                specialChar: false,
                passwordsMatch: false,
            });
            return;
        }

        const requirements = {
            minLength: password.length >= 8,
            number: /[0-9]/.test(password),
            uppercase: /[A-Z]/.test(password),
            specialChar: /[!#$%&]/.test(password),
            passwordsMatch: password === confirmPassword,
        };
        setPasswordRequirements(requirements);
    };

    useEffect(() => {
        if (!isntCustomPassword) {
            updatePasswordRequirements(password);
        }
    }, [password, isntCustomPassword, confirmPassword]);

  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
  };

  const handleResetConfirmation = (confirm: boolean) => {
    if (confirm) {
      setYesToReset(true);
    } else {
        console.log('No');
      onClose(false); // Close modal without resetting password
    }
  };


  const handleResetPassword = async () => {

    const newPassword = isntCustomPassword ? defaultPassword : password;

    const response = await AdminResetUserPassword(userId, newPassword, expirePassword, systemsProvider.apiUrl);

    if (response === true) {
      console.log('Password reset successfully');
      onClose(true);
    } else {
      console.error('There was a problem resetting the password' + response);
      alert('There was a problem resetting the password: ' + response);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={handleModalClick}>
        <div className='modal-body'>
        {yesToReset === false ? (
          <>
            <h2>Reset User Password</h2>
            <p>Are you sure you want to reset the password for this user?</p>
            <p>This user will be notified via email that their password has been reset. They will be provided with the updated password. </p>
            <div className="w-1/2 ml-auto mr-auto flex flex-row justify-center items-center gap-4 pt-8">
                <button className='admin-signin-btn' onClick={() => onClose(false)}>No</button>
                <button className='modal-content-btn' onClick={() => handleResetConfirmation(true)}>Yes</button>
            </div>
          </>
        ) : (
          <>
            <h2>Enter New Password</h2>
            <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
            <div className="flex flex-row gap-2 content-center justify-start w-full">
                <div className="flex flex-col content-center justify-start gap-0 w-full ">
                    <p>Password {!isntCustomPassword ? <strong>*</strong> : <></>}</p>
                    <input 
                        type={!isntCustomPassword ? "password" : "text"} 
                        placeholder="Password" 
                        className="modal-content-input" 
                        onChange={(e) => setPassword(e.target.value)} 
                        maxLength={40}
                        disabled={isntCustomPassword} 
                        value={isntCustomPassword ? defaultPassword : password}
                    />
                </div>
                <div className="flex flex-col content-center items-center justify-start gap-0 w-fit ">
                    <p>Default</p>
                    <input 
                        type="checkbox" 
                        className="modal-content-input m-auto" 
                        checked={isntCustomPassword} 
                        onChange={(e) => setIsntCustomPassword(e.target.checked)} 
                        />
                </div>
            </div>
            {!isntCustomPassword && (
                <div>
                    <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                        <p>Confirm Password<strong>*</strong></p>
                        <input 
                        type="password"
                        placeholder="Confirm Passsword" 
                        className="modal-content-input" 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        maxLength={40}
                        value={confirmPassword}
                    />
                    </div>
                    <div className='pt-2 mb-8'>
                        <ul>
                            <li style={{ color: passwordRequirements.minLength ? 'green' : 'red' }}>At least 8 characters long</li>
                            <li style={{ color: passwordRequirements.number ? 'green' : 'red' }}>Includes a number</li>
                            <li style={{ color: passwordRequirements.uppercase ? 'green' : 'red' }}>Includes an uppercase letter</li>
                            <li style={{ color: passwordRequirements.specialChar ? 'green' : 'red' }}>Includes a special character (!, #, $, %, &)</li>
                            <li style={{ color: passwordRequirements.passwordsMatch ? 'green' : 'red' }}>Passwords match</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
        <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
            <p>Expire Password<strong>*</strong></p>
            <div className='flex flex-row w-full subinfo-text'>
                <input 
                    type="checkbox" 
                    checked={expirePassword}
                    onChange={(e) => setExpirePassword(e.target.checked)}
                />
                <div className='ml-12'>
                    <p className='subinfo-text'>This will ask the user to create a new password upon next signin</p>
                </div>
            </div>

        </div>
            <div className="flex flex-row justify-center items-center gap-4 w-full pt-4">
              <button className='modal-content-btn modal-content-btn sm' onClick={() => handleResetPassword()}>Update</button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminResetUserPasswordModal;
