export interface User {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    needsPasswordReset: boolean;
    confirmedEmail: boolean;
    lastLogin: string;
    last5Logins: string[];
    userExpireAccess: ReturnUserExpireAccessModel[];
    passwordExpiration: string | null;
    streetAddress: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    phoneNumber: string | null;
  }
  
  export interface ReturnUserExpireAccessModel {
    expireStartDate: Date;
    expireEndDate: Date;
    reason?: string; // The '?' makes it optional, similar to the C# nullable string
    AssigneeName: string;
  }
  
  
  export interface UserTableProps {
    users: User[];
    onActiveUserChange: (userId: string) => void;
    onSelectedUsersChange: (userIds: string[]) => void;
    usersNeedRefresh: (userIds: string[]) => void;
  }

  export interface SelectedUserInformationProps {
    selectedUser: User;
  }
