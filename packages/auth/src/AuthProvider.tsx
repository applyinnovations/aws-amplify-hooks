import { AuthContextValuesParams } from './types';
import React from 'react';
import { AuthContext, authContextValues } from './useAuth';

interface AuthProviderProps extends AuthContextValuesParams {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  onSessionStart,
  onSessionFailed,
  children,
}) => {
  const providerValues = authContextValues({
    onSessionStart,
    onSessionFailed,
  });

  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
};
