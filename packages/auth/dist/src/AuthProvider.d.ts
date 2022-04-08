import { AuthContextValuesParams } from './types';
import React from 'react';
interface AuthProviderProps extends AuthContextValuesParams {
    children: JSX.Element | JSX.Element[];
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export {};
