import React, { useContext, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ ...rest }: any) => {
  const { state } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (state.user) {
      history.push('/profile');
    }
  }, [history, state.user]);

  return (
    <div className="container fluid p-5">
      <Route {...rest} />
    </div>
  );
};

export default PublicRoute;
