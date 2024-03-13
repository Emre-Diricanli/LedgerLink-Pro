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
    lockedOut: boolean;
    accessFailedCount: number;
    lockoutEnd: string;
    lastLogin: string;
    last5Logins: string[];
    userExpireAccess: ReturnUserExpireAccessModel[];
    passwordExpiration: string | null;
    profilePictureUrl: string | null;
    streetAddress: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    phoneNumber: string | null;
  }
  
  export interface ReturnUserExpireAccessModel {
    expireId: string;
    expireStartDate: Date;
    expireEndDate: Date;
    reason?: string; // The '?' makes it optional, similar to the C# nullable string
    AssigneeName: string;
  }
  

  export interface SelectedUserInformationProps {
    selectedUser: User;
  }

  export interface UserSigninResult {
    resultSuccess: boolean;
    userNeedsPasswordReset?: boolean;
    user?: User;
    token?: string;
    id?: string;
    code?: number;
  }

export interface UserSignupRequest {
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  apptNumber: string;
}