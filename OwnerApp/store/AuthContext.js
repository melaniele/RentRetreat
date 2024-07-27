import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState("");

  return (
    <AuthContext.Provider value={{ loggedInUserEmail, setLoggedInUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);