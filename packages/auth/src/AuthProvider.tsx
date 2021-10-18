import { AuthContextValuesParams } from "./types";
import React from "react";
import { AuthContext, authContextValues } from "./useAuth";

export const AuthProvider: React.FC<AuthContextValuesParams> = ({
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
