import React, { FormEvent, useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import { auth, googleAuthProvider } from "../../firebase";

import AuthForm from "../../components/forms/AuthForm";
import { AuthContext } from "../../context/authContext";

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

const Login: React.FC = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("prmorais1302@gmail.com");
  const [password, setPassword] = useState<string>("P@ulo1313");
  const [loading, setLoading] = useState<boolean>(false);

  let history = useHistory();

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          const { user } = result;
          const idTokenResult = await user?.getIdTokenResult();

          dispatch({
            type: "LOGGED_IN_USER",
            payload: { email: user?.email, token: idTokenResult?.token },
          });

          // Envia informações para nosso servidor mongodb para criar/atualizar o usuário
          userCreate();

          history.push("/profile");
        });
    } catch (err) {
      console.log("Ocorreu um erro ao fazer login", err.message);
      toast.error(err.message, { autoClose: 5000 });
      setLoading(false);
    }
  };

  const googleLogin = () => {
    auth.signInWithPopup(googleAuthProvider).then(async (result) => {
      const { user } = result;
      const idTokenResult = await user?.getIdTokenResult();

      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user?.email, token: idTokenResult?.token },
      });

      // Envia informações para nosso servidor mongodb para criar/atualizar o usuário
      userCreate();

      history.push("/profile");
    });
  };

  return (
    <div className="container p-5">
      {loading ? <h4 className="text-danger">Acessando...</h4> : <h4>Login</h4>}

      <button onClick={googleLogin} className="btn btn-raised btn-danger mt-5">
        Login com Google
      </button>

      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        loading={loading}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        showPasswordInput={true}
        hideEmailInput={false}
      />

      <Link className="text-danger float-right" to="/password/forgot">
        Esqueci a senha
      </Link>
    </div>
  );
};

export default Login;
