export interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    needsPasswordReset: boolean;
    confirmedEmail: boolean;
    lastLogin: string;
    last5Logins: string[];
    passwordExpiration: string | null;
    streetAddress: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    phoneNumber: string | null;
  }
  
  
  export interface UserTableProps {
    users: User[];
    onActiveUserChange: (userId: string) => void;
    onSelectedUsersChange: (userIds: string[]) => void;
  }

  export interface SelectedUserInformationProps {
    selectedUser: User;
  }
