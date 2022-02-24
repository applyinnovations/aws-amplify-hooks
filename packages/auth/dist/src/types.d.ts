import { CognitoUser } from "amazon-cognito-identity-js";
export declare type ProfileTypes = "profile-1" | "profile-2" | "profile-3" | "profile-4" | "profile-5" | "profile-6";
export interface AuthContextValuesParams {
    onSessionStart: () => void;
    onSessionFailed: () => void;
}
export declare enum ANSWER_CHALLENGE_ERRORS {
    GENERIC_ERROR = "GENERIC_ERROR",
    INCORRECT_CODE = "INCORRECT_CODE"
}
export interface UserAttributes {
    given_name: string;
    family_name: string;
    "custom:postcode": string;
    "custom:country_code": string;
    email: string;
    "custom:avatar": ProfileTypes;
    phone_number: string;
}
interface UserData {
    attributes: UserAttributes;
}
export interface ConfirmationResult {
    success: boolean;
    error?: ANSWER_CHALLENGE_ERRORS;
}
export interface AuthContextValues {
    cognitoUser: UserData | CognitoUser;
    userAttributes: UserAttributes | undefined;
    authenticated: boolean;
    signInUser: (phoneNumber: string, email?: string) => Promise<void>;
    signUpUser: (phoneNumber: string, email: string, countryCode: string) => Promise<CognitoUser | undefined>;
    resendSignUp: (phoneNumber: string, email: string) => Promise<void>;
    confirmSignUp: (phoneNumber: string, email: string, answer: string) => Promise<ConfirmationResult>;
    confirmSignIn: (answer: string) => Promise<ConfirmationResult>;
    signOutUser: () => Promise<void>;
    updateUserData: (params: {
        firstName?: string;
        lastName?: string;
        postCode?: string;
        emailAddress?: string;
        countryCode?: string;
        avatar?: ProfileTypes;
    }) => Promise<void>;
    testFunction: () => string;
}
export {};
