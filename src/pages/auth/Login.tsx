import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { auth } from "../../firebase";

const Login: React.FC = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("prmorais1302@gmail.com");
  const [password, setPassword] = useState<string>("P@ulo1313");
  const [loading, setLoading] = useState<boolean>(false);
  const [success] = useState<boolean>(false);

  let history = useHistory();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (resuult) => {
          const { user } = resuult;
          const idTokenResult = await user?.getIdTokenResult();

          dispatch({
            type: "LOGGED_IN_USER",
            payload: { email: user?.email, token: idTokenResult?.token },
          });

          // Envia informações para nosso servidor mongodb para criar/atualizar o usuário
          history.push("/");
        });
    } catch (err) {
      console.log("Ocorreu um erro ao fazer login", err.message);
      toast.error(err.message, { autoClose: 5000 });
      return;
    }
  };

  return (
    <div className="container p-5">
      <h4>Login</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="Entre com o e-mail"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Entre com a Senha"
            disabled={loading}
          />
        </div>
        <button
          className="btn btn-raised btn-primary"
          disabled={!email || !password || loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
