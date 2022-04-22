/// <reference types="react" />
import { AuthContextValues, AuthContextValuesParams } from "./types";
export declare const AuthContext: import("react").Context<AuthContextValues<{}>>;
export declare function authContextValues<CustomUserAttributes = any>({ onSessionStart, onSessionFailed, }: AuthContextValuesParams): AuthContextValues<CustomUserAttributes>;
export declare const useAuth: () => AuthContextValues<{}>;
