import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Nav: React.FC = () => {
  const { state, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const { user } = state;

  const logout = () => {
    auth.signOut();

    dispatch({
      type: 'LOGGED_IN_USER',
      user: {
        email: '',
        token: '',
      },
    });

    history.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Navbar
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {user && (
            <li className="nav-item active">
              <Link className="nav-link" to="/profile">
                {
                 user.email && user.email.split('@')[0]
                }
              </Link>
            </li>
          )}

          {!user && (
            <>
              <li className="nav-item active">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Registrar
                </Link>
              </li>
            </>
          )}
          {user && (
            <li className="nav-item">
              <a onClick={logout} className="nav-item nav-link" href="/login">
                Sair
              </a>
            </li>
          )}
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Buscar"
            aria-label="Buscar"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Buscar
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Nav;
