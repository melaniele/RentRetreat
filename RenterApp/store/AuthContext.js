import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState('');
  const [userCityLocation, setUserCityLocation] = useState('');

  return (
    <AuthContext.Provider
      value={{
        loggedInUserEmail,
        setLoggedInUserEmail,
        userCityLocation,
        setUserCityLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
