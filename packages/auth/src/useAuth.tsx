import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Hub } from "@aws-amplify/core";
import { CognitoUser } from "amazon-cognito-identity-js";
import { MD5 } from "crypto-js";

import {
  useState,
  useMemo,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from "react";

import {
  ANSWER_CHALLENGE_ERRORS,
  AuthContextValues,
  AuthContextValuesParams,
  SignUpParams,
} from "./types";

export const AuthContext = createContext<AuthContextValues>({
  cognitoUser: undefined,
  authenticated: false,
  signInUser: () => Promise.resolve(),
  resendSignUp: () => Promise.resolve(undefined),
  signUpUser: () => Promise.resolve(undefined),
  confirmSignUp: () => Promise.resolve({ success: false }),
  confirmSignIn: () => Promise.resolve({ success: false }),
  signOutUser: () => Promise.resolve(),
  updateUserData: () => Promise.resolve(),
});

export function authContextValues<CustomUserAttributes = any>({
  onSessionStart,
  onSessionFailed,
}: AuthContextValuesParams): AuthContextValues<CustomUserAttributes> {
  const [authenticated, setAuthenticated] = useState(false);
  const [cognitoUser, setCognitoUser] = useState<CognitoUser>();

  const handleSessionStart = useCallback(async () => {
    onSessionStart();
    const userFetched = await Auth.currentAuthenticatedUser();
    setCognitoUser(userFetched);
    setAuthenticated(true);
  }, [onSessionStart]);

  const handleSessionFailed = useCallback(async () => {
    onSessionFailed();
    setAuthenticated(false);
  }, [onSessionFailed]);

  useEffect(() => {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          console.log("user signed in");
          handleSessionStart();
          break;
        case "signUp":
          console.log("user signed up");
          break;
        case "signOut":
          console.log("user signed out");
          handleSessionFailed();
          break;
        case "signIn_failure":
          console.log("user sign in failed");
          handleSessionFailed();
          break;
      }
    });
    (async () =>
      await Auth.currentAuthenticatedUser()
        .then(() => handleSessionStart())
        .catch((_) => handleSessionFailed()))();
  }, []);

  const signInUser = useCallback(
    async (phone: string, password?: string) => {
      const newUserData = await Auth.signIn(
        phone,
        password ?? getPassword(phone)
      );
      setCognitoUser(newUserData);
    },
    [Auth]
  );

  const getPassword = (phoneNumber: string) => MD5(`${phoneNumber}`).toString();

  const signUpUser = useCallback(
    async ({
      phoneNumber,
      email,
      password,
      customUserAttributes,
    }: SignUpParams): Promise<CognitoUser> => {
      const result = await Auth.signUp({
        username: phoneNumber,
        // MFA is forced therefore we do not need a password
        password: password ?? getPassword(phoneNumber),
        attributes: {
          email,
          phone_number: phoneNumber,
          ...customUserAttributes,
        },
      });
      return result.user;
    },
    []
  );

  const getUser = useCallback(
    async (): Promise<any> =>
      new Promise((res, rej) => {
        Auth.currentAuthenticatedUser({
          bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        })
          .then((item) => res(item))
          .catch(rej);
      }),
    [Auth]
  );

  const updateUserData = useCallback(
    async (data) => {
      await Auth.updateUserAttributes(cognitoUser, data);
      const newCognitoUser = await getUser();
      setCognitoUser(newCognitoUser);
    },
    [Auth, cognitoUser, getUser]
  );

  const confirmSignUp = useCallback(
    async (phoneNumber, answer) => {
      try {
        await Auth.confirmSignUp(phoneNumber, answer);
        await signInUser(phoneNumber);
        return { success: true };
      } catch (e) {
        console.log(e);
        if (e === "No current user") {
          return {
            success: false,
            error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
          };
        }
        throw e;
      }
    },
    [cognitoUser, Auth]
  );

  const resendSignUp = useCallback(
    async (phoneNumber: string) => {
      await Auth.resendSignUp(phoneNumber);
    },
    [Auth]
  );

  const confirmSignIn = useCallback(
    async (answer: string) => {
      try {
        const user = await Auth.confirmSignIn(cognitoUser, answer);
        setCognitoUser(user);
        return { success: true };
      } catch (e) {
        console.error(e);
        if (e === "No current user") {
          return {
            success: false,
            error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
          };
        }
        throw e;
      }
    },
    [cognitoUser, Auth]
  );

  const signOutUser = useCallback(async () => {
    await Auth.signOut();
    await DataStore.clear();
  }, [Auth]);

  const userAttributes = useMemo(() => {
    // @ts-ignore
    return cognitoUser?.attributes;
  }, [cognitoUser]);

  return useMemo(
    () => ({
      cognitoUser,
      authenticated,
      confirmSignUp,
      resendSignUp,
      signInUser,
      signUpUser,
      confirmSignIn,
      signOutUser,
      updateUserData,
    }),
    [
      cognitoUser,
      authenticated,
      confirmSignUp,
      resendSignUp,
      signInUser,
      signUpUser,
      confirmSignIn,
      signOutUser,
      updateUserData,
      userAttributes,
    ]
  );
}

export const useAuth = () => useContext(AuthContext);
