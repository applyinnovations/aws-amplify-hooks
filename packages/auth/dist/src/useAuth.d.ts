/// <reference types="react" />
import { AuthContextValues, AuthContextValuesParams } from "./types";
export declare const AuthContext: import("react").Context<AuthContextValues>;
export declare const authContextValues: ({ onSessionStart, onSessionFailed, }: AuthContextValuesParams) => AuthContextValues;
export declare const useAuth: () => AuthContextValues;
