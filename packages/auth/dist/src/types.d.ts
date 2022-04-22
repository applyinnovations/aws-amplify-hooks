import { CognitoUser } from "amazon-cognito-identity-js";
export interface AuthContextValuesParams {
    onSessionStart: () => void;
    onSessionFailed: () => void;
}
export declare enum ANSWER_CHALLENGE_ERRORS {
    INCORRECT_CODE = "INCORRECT_CODE"
}
export interface ConfirmationResult {
    success: boolean;
    error?: ANSWER_CHALLENGE_ERRORS;
}
export interface SignUpParams {
    phoneNumber: string;
    email: string;
    password?: string;
    customUserAttributes?: {
        [key: string]: any;
    };
}
export interface UserAttributes {
    address: string;
    birthdate: string;
    email: string;
    family_name: string;
    gender: string;
    given_name: string;
    locale: string;
    middle_name: string;
    name: string;
    nickname: string;
    phone_number: string;
    picture: string;
    preferred_username: string;
    profile: string;
    updated_at: string;
    website: string;
    zoneinfo: string;
    phone_number_verified: boolean;
    email_verified: boolean;
}
export interface AuthContextValues {
    cognitoUser?: CognitoUser;
    authenticated: boolean;
    signInUser: (phoneNumber: string, password?: string) => Promise<void>;
    signUpUser: (params: SignUpParams) => Promise<CognitoUser | undefined>;
    resendSignUp: (phoneNumber: string, email: string) => Promise<void>;
    confirmSignUp: (phoneNumber: string, answer: string) => Promise<ConfirmationResult>;
    confirmSignIn: (answer: string) => Promise<ConfirmationResult>;
    signOutUser: () => Promise<void>;
    updateUserAttributes: (data: Partial<UserAttributes>) => Promise<void>;
    userAttributes: UserAttributes | null;
}
