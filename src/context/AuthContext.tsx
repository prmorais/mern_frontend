import React, {
 createContext, Dispatch, useEffect, useReducer,
} from 'react';
import { auth } from '../firebase';

interface IUser {
  email: string | null,
  token: string,
}

type UserState = {
  user: IUser
}

type UserAction = {
  type: string,
  user: IUser,
}

// type DispatchType = (args: UserAction) => UserAction

// Reducer
const firebaseReducer = (
  state: UserState = initialState,
  action: UserAction,
) => {
  switch (action.type) {
    case 'LOGGED_IN_USER':
      return { ...state, user: action.user };

    default:
      return state;
  }
};

// State
const initialState: UserState = {
  user: {
    email: '',
    token: '',
  },
};

// Dispatch
const initialDispatch: Dispatch<UserAction> = (f:UserAction) => f;

// Create context
const AuthContext = createContext({
  state: initialState,
  dispatch: initialDispatch,
});

// Context provider
const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: 'LOGGED_IN_USER',
          user: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
      } else {
        dispatch({
          type: 'LOGGED_IN_USER',
          user: { email: '', token: '' },
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
