import { Auth, DataStore, Hub } from "aws-amplify";
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
  UserAttributes,
} from "./types";

const DEFAULT_USER_DATA = {
  phone_number: "",
  given_name: "",
  family_name: "",
  "custom:postcode": "",
  "custom:country_code": "",
  "custom:avatar": "profile-1",
  email: "",
} as UserAttributes;

export const AuthContext = createContext<AuthContextValues>({
  cognitoUser: {
    attributes: DEFAULT_USER_DATA,
  },
  userAttributes: DEFAULT_USER_DATA,
  authenticated: false,
  signInUser: () => Promise.resolve(),
  resendSignUp: () => Promise.resolve(undefined),
  signUpUser: () => Promise.resolve(undefined),
  confirmSignUp: () => Promise.resolve({ success: false }),
  confirmSignIn: () => Promise.resolve({ success: false }),
  signOutUser: () => Promise.resolve(),
  updateUserData: (_) => Promise.resolve(),
  testFunction: () => "testing versioning function",
});

const getParamsWithDefaultValue = (field: string, value: string) =>
  value ? { [field]: value } : {};

export const authContextValues = ({
  onSessionStart,
  onSessionFailed,
}: AuthContextValuesParams): AuthContextValues => {
  const [authenticated, setAuthenticated] = useState(false);
  const [cognitoUser, setCognitoUser] = useState({
    attributes: DEFAULT_USER_DATA,
  });

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

  const handleSessionStart = useCallback(async () => {
    onSessionStart();
    const userFetched = await getUser();
    setCognitoUser(userFetched);
    setAuthenticated(true);
  }, [getUser, onSessionStart]);

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
    async (phone: string, email?: string) => {
      const username = email ? getUserName(phone, email) : phone;

      const newUserData = await Auth.signIn(username, getPassword(phone));
      setCognitoUser(newUserData);
    },
    [Auth]
  );

  const getUserName = (phoneNumber: string, email: string) =>
    MD5(`${phoneNumber} ${email}`).toString();

  const getPassword = (phoneNumber: string) => MD5(`${phoneNumber}`).toString();

  const signUpUser = useCallback(
    async (
      phoneNumber: string,
      email: string,
      countryCode: string
    ): Promise<CognitoUser> => {
      try {
        const result = await Auth.signUp({
          username: getUserName(phoneNumber, email),
          // MFA is forced therefore we do not need a password
          password: getPassword(phoneNumber),
          attributes: {
            email,
            phone_number: phoneNumber,
            "custom:country_code": countryCode,
            "custom:avatar": "profile-1",
          },
        });
        return result.user;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    []
  );

  const confirmSignUp = useCallback(
    async (phoneNumber: string, email: string, answer: string) => {
      try {
        const username = getUserName(phoneNumber, email);
        await Auth.confirmSignUp(username, answer);
        await signInUser(phoneNumber, email);
        return { success: true };
      } catch (e) {
        console.log(e);
        if (e === "No current user") {
          return {
            success: false,
            error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
          };
        }
        return { success: false, error: ANSWER_CHALLENGE_ERRORS.GENERIC_ERROR };
      }
    },
    [cognitoUser, Auth]
  );

  const resendSignUp = useCallback(
    async (phoneNumber: string, email: string) => {
      await Auth.resendSignUp(getUserName(phoneNumber, email));
    },
    [Auth]
  );

  const confirmSignIn = useCallback(
    async (answer: string) => {
      try {
        const user = await Auth.confirmSignIn(cognitoUser, answer);
        setCognitoUser(user);
        console.log("User logged in");
        return { success: true };
      } catch (e) {
        console.log(e);
        if (e === "No current user") {
          return {
            success: false,
            error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
          };
        }
        return { success: false, error: ANSWER_CHALLENGE_ERRORS.GENERIC_ERROR };
      }
    },
    [cognitoUser, Auth]
  );

  const signOutUser = useCallback(async () => {
    try {
      await Auth.signOut();
      await DataStore.clear();
      console.log("user signed out");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }, [Auth]);

  const updateUserData = useCallback(
    async (data) => {
      try {
        await Auth.updateUserAttributes(cognitoUser, {
          ...getParamsWithDefaultValue("family_name", data.lastName),
          ...getParamsWithDefaultValue("given_name", data.firstName),
          ...getParamsWithDefaultValue("custom:postcode", data.postCode),
          ...getParamsWithDefaultValue("email", data.emailAddress),
          ...getParamsWithDefaultValue("custom:country_code", data.countryCode),
          ...getParamsWithDefaultValue("custom:avatar", data.avatar),
        });

        const newCognitoUser = await getUser();

        setCognitoUser(newCognitoUser);
      } catch (e) {
        console.log("Error while updating user", e);
        alert("something went wrong");
      }
    },
    [Auth, cognitoUser]
  );

  const userAttributes = useMemo(() => {
    return cognitoUser?.attributes;
  }, [cognitoUser]);

  const testFunction = () => "testing versioning function";

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
      userAttributes,
      testFunction,
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
      testFunction,
    ]
  );
};

export const useAuth = () => useContext(AuthContext);
