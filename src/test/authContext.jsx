import React, { createContext, useEffect, useReducer } from 'react';
import { auth } from '../firebase';

// Reducer
const firebaseReducer = (state, action) => {
  switch (action.type) {
    case 'LOGGED_IN_USER':
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

// State
const initialState = {
  user: null,
};

// Create context
const AuthContext = createContext();

// Context provider
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
      } else {
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: null,
        });
      }
    });
    // Limpa a subscription
    return () => unsubcribe();
  }, []);

  const value = { state, dispatch };

  return (
    <AuthContext.Provider value={value}>
      {' '}
      {children}
      {' '}
    </AuthContext.Provider>
  );
};

// Export
export { AuthContext, AuthProvider };
