// @TODO Move this back to aws-amplify-hooks repo

import { CognitoUser, CodeDeliveryDetails } from "amazon-cognito-identity-js";

export interface AuthContextValuesParams {
  onSessionStart: () => void;
  onSessionFailed: () => void;
}

export enum ANSWER_CHALLENGE_ERRORS {
  INCORRECT_CODE = "INCORRECT_CODE",
}

export enum SIGN_IN_ERROR_CODES {
  UserNotFoundException = "UserNotFoundException",
  UserNotConfirmedException = "UserNotConfirmedException",
}

export enum SIGN_IN_OR_CREATE_ACTIONS {
  SignIn = "SignIn",
  SignUp = "SignUp",
}

export interface ConfirmationResult {
  success: boolean;
  error?: ANSWER_CHALLENGE_ERRORS;
}

export interface SignUpParams {
  phoneNumber: string;
  password?: string;
}

interface Address {
  formatted?: string;
  street_address?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}

export interface UserAttributes {
  email?: string;
  email_verified?: boolean;
  family_name?: string;
  given_name?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: Address;
  birthdate?: string;
  gender?: string;
  locale?: string;
  middle_name?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  preferred_username?: string;
  profile?: string;
  updated_at?: number;
  website?: string;
  zoneinfo?: string;
}

export interface AuthState {
  needToConfirmMobileNumber: boolean;
}

export interface SignInOrCreateResponse {
  user?: CognitoUserWithAttributes;
  codeDeliveryDetails?: CodeDeliveryDetails;
  error?: string;
  action: "SignIn" | "SignUp";
}

export type CognitoUserWithAttributes = CognitoUser & {
  attributes?: UserAttributes;
};

export interface AuthContextValues {
  cognitoUser?: CognitoUserWithAttributes;
  authenticated: boolean;
  signInOrCreateUser: (
    phoneNumber: string,
    password?: string
  ) => Promise<SignInOrCreateResponse>;
  resendSignUp: (phoneNumber: string) => Promise<void>;
  confirmSignUp: (
    phoneNumber: string,
    answer: string
  ) => Promise<ConfirmationResult>;
  confirmSignIn: (answer: string) => Promise<ConfirmationResult>;
  signOutUser: () => Promise<void>;
  updateUserAttributes: (data: UserAttributes) => Promise<void>;
  userAttributes?: UserAttributes | null;
}
