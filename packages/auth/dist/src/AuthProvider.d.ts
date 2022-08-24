import React from "react";
import { AuthContextValues, AuthContextValuesParams } from "./types";
interface AuthProviderProps extends AuthContextValuesParams {
    children: JSX.Element | JSX.Element[];
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export declare const useAuth: () => AuthContextValues;
export {};
