import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from "react";
import { Auth } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { Hub } from "@aws-amplify/core";
import type { HubCallback } from "@aws-amplify/core";
import { CognitoUser, CodeDeliveryDetails } from "amazon-cognito-identity-js";
import {
  ANSWER_CHALLENGE_ERRORS,
  SIGN_IN_ERROR_CODES,
  SIGN_IN_OR_CREATE_ACTIONS,
  AuthContextValues,
  AuthContextValuesParams,
  CognitoUserWithAttributes,
  SignInOrCreateResponse,
  MFA_OPTIONS,
} from "./types";
import { MD5 } from "crypto-js";

interface AuthProviderProps extends AuthContextValuesParams {
  children: JSX.Element | JSX.Element[];
}

const AuthContext = createContext<AuthContextValues>({
  cognitoUser: undefined,
  authenticated: false,
  signInOrCreateUser: () => Promise.resolve({ action: "SignUp" }),
  resendSignUp: () => Promise.resolve(undefined),
  confirmSignUp: () => Promise.resolve({ success: false }),
  confirmSignIn: () => Promise.resolve({ success: false }),
  signOutUser: () => Promise.resolve(),
  updateUserAttributes: () => Promise.resolve(),
  userAttributes: null,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({
  onSessionStart,
  onSessionFailed,
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [cognitoUser, setCognitoUser] = useState<CognitoUserWithAttributes>();
  const [cognitoUserSignIn, setCognitoUserSignIn] = useState<CognitoUser>();

  const handleSessionStart = useCallback(async () => {
    try {
      const user = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      setCognitoUser(user);
      setAuthenticated(true);
      onSessionStart();
    } catch (e) {
      handleSessionFailed();
    }
  }, [onSessionStart]);

  const handleSessionFailed = useCallback(() => {
    setAuthenticated(false);
    onSessionFailed();
  }, [onSessionFailed]);

  useEffect(() => {
    const authListener: HubCallback = (data) => {
      switch (data.payload.event) {
        case SIGN_IN_OR_CREATE_ACTIONS.SignIn:
          console.log("user signed in");
          break;
        case "signUp":
          console.log("user signed up");
          break;
        case "signOut":
          console.log("user signed out");
          handleSessionFailed();
          break;
        case "signIn_failure":
          console.log("user signed failed");
          handleSessionFailed();
          break;
      }
    };

    Hub.listen("auth", authListener);
    (async () => {
      Auth.currentAuthenticatedUser()
        .then(() => handleSessionStart())
        .catch((_) => handleSessionFailed());
    })();

    return () => {
      Hub.remove("auth", authListener);
    };
  }, []);

  const signInOrCreateUser = useCallback(
    async (phone: string): Promise<SignInOrCreateResponse> => {
      let user: CognitoUserWithAttributes | undefined;
      let codeDeliveryDetails: CodeDeliveryDetails | undefined;
      let error: undefined | string;
      let action: SIGN_IN_OR_CREATE_ACTIONS = SIGN_IN_OR_CREATE_ACTIONS.SignUp;

      // MFA is forced therefore we do not need a password
      const hashedPassword = getPassword(phone);
      try {
        const signInUser = await Auth.signIn(phone, hashedPassword);
        console.log("user sign in user", signInUser);

        // sign in have a different response so we just format it to be consistent
        codeDeliveryDetails =
          signInUser.challengeName === "SMS_MFA"
            ? {
                AttributeName: "phone_number",
                DeliveryMedium:
                  signInUser.challengeParam.CODE_DELIVERY_DELIVERY_MEDIUM,
                Destination:
                  signInUser.challengeParam.CODE_DELIVERY_DESTINATION,
              }
            : undefined;
        action = SIGN_IN_OR_CREATE_ACTIONS.SignIn;

        setCognitoUserSignIn(signInUser);

        // only set authenticated if there is no MFA
        // if there is MFA authenticated will be set after confirming the code
        if (!codeDeliveryDetails) {
          user =
            (await Auth.currentAuthenticatedUser()) as CognitoUserWithAttributes;

          // ensure SMS MFA is on set on user that have verified phone number
          if (
            user.preferredMFA === MFA_OPTIONS.NOMFA &&
            user.attributes?.phone_number_verified
          ) {
            await Auth.setPreferredMFA(signInUser, MFA_OPTIONS.SMS);
            // ask to sign in again with MFA enabled
            return signInOrCreateUser(phone);
          } else {
            setAuthenticated(true);
          }
        }
      } catch (err) {
        const e = err as { code?: string; message?: string };
        console.log("Sign in error", e);
        if (!e?.code) {
          return {
            action,
            error: e.message || "Unknown Error",
          };
        }

        error = e.code;

        if (e.code === SIGN_IN_ERROR_CODES.UserNotFoundException) {
          const result = await Auth.signUp({
            username: phone,
            password: hashedPassword,
            attributes: {
              phone_number: phone,
            },
          });

          codeDeliveryDetails = result.codeDeliveryDetails;
          user = result.user;
        } else if (e.code === SIGN_IN_ERROR_CODES.UserNotConfirmedException) {
          const result = await Auth.resendSignUp(phone);

          codeDeliveryDetails = result.codeDeliveryDetails;
        }
      }

      setCognitoUser(user);

      return {
        user,
        codeDeliveryDetails,
        error,
        action,
      };
    },
    [
      Auth,
      setAuthenticated,
      setCognitoUser,
      setCognitoUserSignIn,
      SIGN_IN_OR_CREATE_ACTIONS,
    ]
  );

  const getPassword = (phoneNumber: string) => MD5(`${phoneNumber}`).toString();

  const updateUserAttributes = useCallback(
    async (data) => {
      await Auth.updateUserAttributes(cognitoUser, data);
      const newCognitoUser = await Auth.currentAuthenticatedUser({
        bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      });
      setCognitoUser(newCognitoUser);
    },
    [Auth, cognitoUser]
  );

  const confirmSignUp = useCallback(
    async (phoneNumber, answer) => {
      try {
        await Auth.confirmSignUp(phoneNumber, answer);
        await Auth.signIn(phoneNumber, getPassword(phoneNumber));
        const user = await Auth.currentAuthenticatedUser();
        await Auth.setPreferredMFA(user, MFA_OPTIONS.SMS);
        const updatedUser = await Auth.currentAuthenticatedUser();
        setCognitoUser(updatedUser);
        setAuthenticated(true);
        return { success: true };
      } catch (e) {
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
        await Auth.confirmSignIn(cognitoUserSignIn, answer);
        const user = await Auth.currentAuthenticatedUser();
        setCognitoUser(user);
        setAuthenticated(true);
        return { success: true };
      } catch (e) {
        console.log("Sign In Error", e);
        if (e === "No current user") {
          return {
            success: false,
            error: ANSWER_CHALLENGE_ERRORS.INCORRECT_CODE,
          };
        }
        throw e;
      }
    },
    [Auth, cognitoUserSignIn]
  );

  const signOutUser = useCallback(
    () => Promise.all([Auth.signOut(), DataStore.clear()]).then(() => {}),
    [Auth, DataStore]
  );

  const userAttributes = useMemo(() => {
    // @ts-ignore
    return cognitoUser?.attributes;
  }, [cognitoUser]);

  const values = useMemo(
    () => ({
      cognitoUser,
      authenticated,
      confirmSignUp,
      resendSignUp,
      confirmSignIn,
      signOutUser,
      updateUserAttributes,
      signInOrCreateUser,
      userAttributes,
    }),
    [
      cognitoUser,
      authenticated,
      confirmSignUp,
      resendSignUp,
      confirmSignIn,
      signOutUser,
      updateUserAttributes,
      signInOrCreateUser,
      userAttributes,
    ]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
