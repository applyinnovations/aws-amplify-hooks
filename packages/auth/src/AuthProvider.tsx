import { AuthContextValuesParams } from "./types";
import React, { useEffect } from "react";
import { AuthContext, authContextValues } from "./useAuth";
import Amplify from "aws-amplify";

export const AuthProvider: React.FC<AuthContextValuesParams> = ({
  onSessionStart,
  onSessionFailed,
  children,
  awsConfig,
}) => {
  const providerValues = authContextValues({
    onSessionStart,
    onSessionFailed,
  });
  useEffect(() => {
    Amplify.configure(awsConfig);
  }, [Amplify]);
  return (
    <AuthContext.Provider value={providerValues}>
      {children}
    </AuthContext.Provider>
  );
};
