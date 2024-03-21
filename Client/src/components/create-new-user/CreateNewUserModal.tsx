import { useEffect, useState } from 'react';
import React from 'react';
import './CreateNewUserModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowsRotate, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ValidateUsername } from '../../services/UserService';
import { debounce } from '../util/Debounce';
import { ValidateEmail } from '../../services/UserService';
import { SystemsProvider, useSystems } from '../../Providers/SystemsProvider';
import { NewUser } from '../interfaces/Users';
import { useUser } from '../../Providers/UserProvider';


interface UserModalProps {
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const systemsProvider = useSystems();
    const userProvider = useUser();
    const [username, setUsername] = React.useState('');
    const [defaultUsername, setDefaultUsername] = React.useState(''); // This is the default username for the user, which is generated when the user is created
    const [isntCustomUsername, setIsntCustomUsername] = React.useState(true);
    const [checkingUsernameAvailability, setCheckingUsernameAvailability] = React.useState(false); // This is used to check if the username is avaliable, if it is not, the user will be prompted to change it
    const [usernameAvaliable, setUsernameAvaliable] = React.useState(true); // This is used to check if the username is avaliable, if it is not, the user will be prompted to change it
    const [usernameRequirements, setUsernameRequirements] = useState({
        minLength: false,
        number: false,
    });

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
    

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const [email, setEmail] = React.useState('');

    const [roleOptions, setRoleOptions] = React.useState<{[key: string]: number}>({});
    const [selectedRole, setSelectedRole] = React.useState('User');


    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Find the key by its value
        const selectedKey = Object.keys(roleOptions).find(key => roleOptions[key] === parseInt(event.target.value));
        setSelectedRole(selectedKey || '');
    };
    

    const [creatingNewUser, setCreatingNewUser] = React.useState(false);


    useEffect(() => {
        //role options are user, manager, admin
        setRoleOptions({User: 1, Manager: 2, Admin: 3});
    }, []);

    const handleUsernameUpdate = () => {
        //username is first initial + last name and random number between 100 and 999
        const randomNum = Math.floor(Math.random() * 900) + 100;
        setDefaultUsername((firstName.charAt(0) + lastName + randomNum).toLowerCase());
        setUsername((firstName.charAt(0) + lastName + randomNum).toLowerCase());
    };

    const usernameIsValid = (username: string) => {
        const isThreeCharacters = username.length >= 3;
        const containsNumber = /\d/.test(username);
    
        //console.log(`Validation for '${username}': Length is 3 (${isThreeCharacters}), Contains number (${containsNumber})`);
    
        //update username requirements
        setUsernameRequirements({
            minLength: isThreeCharacters,
            number: containsNumber,
        });

        if (isThreeCharacters && containsNumber) {
            return true;
        }
    }
    
    const checkUsernameAvailability = async (newUsername : string) => {
        const trimmedUsername = newUsername.trim();

        //check if username is valid
        if (!usernameIsValid(trimmedUsername)) {
            // console.log('Username is not valid: ' + trimmedUsername);
            setUsernameAvaliable(false);
            return;
        } else {

        }

        setCheckingUsernameAvailability(true);
        // console.log('Checking username availability: ' + trimmedUsername);
        const response = await ValidateUsername(trimmedUsername, systemsProvider.apiUrl);

         if (response === false) {
            setCheckingUsernameAvailability(false);
            setUsernameAvaliable(false);
              
         } else {
            setCheckingUsernameAvailability(false);
            setUsernameAvaliable(true);
         }
    }

    const checkEmailAvailability = async (newEmail : string) => {
        const trimmedEmail = newEmail.trim();
        const response = await ValidateEmail(trimmedEmail, systemsProvider.apiUrl);
        if (response === false) {
            console.log('Email is not available: ' + newEmail);
            return false;
        } else {
            console.log('Email is available: ' + newEmail);
            return true;
        }
    };

    // Create a debounced version of the validation function
    const debouncedCheckUsername = React.useCallback(debounce((newUsername : string) => {
        checkUsernameAvailability(newUsername);
    }, 500), []); // Adjust 500ms to whatever delay you think is appropriate

    

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
    


    const handleCreateNewUser = async () => {
        //set creating new user to true
        setCreatingNewUser(true);

        //validate fields
        //validate role
        // if (selectedRole === 0) {
        //     setCreatingNewUser(false);
        //     alert('Role is not valid');
        //     return;
        // }

        //validate email
        if (email === '') {
            setCreatingNewUser(false);
            alert('Email is not valid');
            return;
        }

        if (!checkEmailAvailability(email)) {
            setCreatingNewUser(false);
            alert('Email is in an invalid format or is already in use');
            return;
        }

        //validate first and last name
        if (firstName === '' || lastName === '') {
            setCreatingNewUser(false);
            alert('First and Last Name are not valid');
            return;
        }

        //ensure first and last name are 2 characters or more
        if (firstName.length < 2 || lastName.length < 2) {
            setCreatingNewUser(false);
            alert('First and Last Name are not valid');
            return;
        }

        //validate username
        if (!usernameIsValid(username)) {
            setCreatingNewUser(false);
            console.log('Username is not valid: ' + username);
            alert('Username is not valid');
            return;
        }

        if (!checkUsernameAvailability(username)) {
            setCreatingNewUser(false);
            alert('Username is not available');
            return;
        }

        //validate password
        //if not using a custom password then set password to default
        if (isntCustomPassword) {
            console.log('Using default password: ' + defaultPassword);
            setPassword(defaultPassword);
        } 
        else {
            //update password requirements
            updatePasswordRequirements(password);

            if (!passwordRequirements.minLength || !passwordRequirements.number || !passwordRequirements.uppercase || !passwordRequirements.specialChar) {
                setCreatingNewUser(false);
                console.log('Password Minlength: ' + passwordRequirements.minLength);
                console.log('Password Number: ' + passwordRequirements.number);
                console.log('Password Uppercase: ' + passwordRequirements.uppercase);
                console.log('Password Special Char: ' + passwordRequirements.specialChar);
                console.log('Password is not valid: ' + password);
                alert('Password is not valid: ' + password);
                return;
            }

            //validate confirm password
            if (password !== confirmPassword) {
                setCreatingNewUser(false);
                alert('Passwords do not match');
                return;
            }
        }

        const newUser : NewUser = {
            role: selectedRole,
            email: email,
            password: isntCustomPassword ? defaultPassword : password,
            firstName: firstName,
            lastName: lastName,
            username: username,
        }

        const response = await userProvider.CreateNewUser(newUser);

        if (response === false) {
            setCreatingNewUser(false);
            alert('There was a problem creating the new user');
            return;
        } else {
            setCreatingNewUser(false);
            onClose(true);
        }
    };

    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // This prevents the click from propagating to the backdrop
    };


  return (
    <div className="modal-backdrop" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={handleModalClick}>
        <div className='modal-body'>
            {/* <button onClick={onClose}>Close</button> */}
            <div className="flex flex-row items-center justify-start gap-2 w-full pb-2">
                <h2>Create New User</h2>
            </div>

            <div className="flex flex-col content-center justify-start gap-0 w-full pt-4">
                <p>Role<strong>*</strong></p>
                <select value={roleOptions[selectedRole]} onChange={handleRoleChange} >
                    {Object.keys(roleOptions).map((role) => (
                        <option key={role} value={roleOptions[role]}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                <p>Email<strong>*</strong></p>
                <input type="text" placeholder="Email" className="modal-content-input" onChange={(e) => setEmail(e.target.value)} maxLength={40}/>
            </div>
            <div className="flex flex-row gap-2 content-center justify-start w-full pt-8">
                <div className="flex flex-col content-center justify-start gap-0 w-full ">
                    <p>First Name<strong>*</strong></p>
                    <input type="text" placeholder="First Name" className="modal-content-input" onChange={(e) => { setFirstName(e.target.value); handleUsernameUpdate(); }} maxLength={30}/>
                </div>
                <div className="flex flex-col content-center justify-start gap-0 w-full ">
                    <p>Last Name<strong>*</strong></p>
                    <input type="text" placeholder="Last Name" className="modal-content-input" onChange={(e) => { setLastName(e.target.value); handleUsernameUpdate(); }} maxLength={30}/>
                </div>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
            <div className="flex flex-row gap-2 content-center justify-start w-full">
                <div className="flex flex-col content-center justify-start gap-0 w-full ">
                    <div className='flex flex-row'>
                        <p>Username {!isntCustomUsername ? <strong>*</strong> : <></>}</p>
                        <div className='ml-4'>
                            {checkingUsernameAvailability ? (
                                <FontAwesomeIcon icon={faArrowsRotate} className='icon-spinning' size='lg'/>
                                ) : usernameAvaliable ? (
                                    <FontAwesomeIcon icon={faCheck} className='icon-green' size='lg'/>
                                ) : (
                                    <FontAwesomeIcon icon={faXmark} className='icon-red' size='lg'/>
                                )}
                        </div>
                    </div>
                    <input 
                        type="text" 
                        placeholder={isntCustomUsername ? "*" : "Username"} 
                        className="modal-content-input" 
                        onChange={(e) => {
                            const newUsername = e.target.value.toLowerCase();
                            setUsername(newUsername);
                            if (!isntCustomUsername) {
                                debouncedCheckUsername(newUsername);
                            }
                        }} 
                        maxLength={40}
                        disabled={isntCustomUsername} 
                        value={isntCustomUsername ? defaultUsername : username}
                    />
                </div>
                    
                <div className="flex flex-col content-center items-center justify-start gap-0 w-fit ">
                    <p>Default</p>
                    <input 
                        type="checkbox" 
                        className="modal-content-input m-auto" 
                        checked={isntCustomUsername} 
                        onChange={(e) => setIsntCustomUsername(e.target.checked)} 
                        />
                </div>
            </div>
            { !isntCustomUsername ? (
                        <ul>
                            <li style={{ color: usernameRequirements.minLength ? 'green' : 'red' }}>At least 3 characters long</li>
                            <li style={{ color: usernameRequirements.number ? 'green' : 'red' }}>Includes a number</li>
                        </ul>
                    ) : <></> }
            </div>

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
                        <div className='pt-2'>
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
            <div className="flex flex-row content-center justify-center gap-2 w-full pt-8">
                <p>This user will receive an email with login credentials asking to confirm their email before signing in.</p>
            </div>
            <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                {creatingNewUser ? (
                    <FontAwesomeIcon icon={faArrowsRotate} className='icon-spinning' size='lg'/>
                ) : (
                    <button className="modal-content-btn" onClick={handleCreateNewUser}>Create New User</button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
