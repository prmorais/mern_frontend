import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../firebase";

const CompleteRegistration: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  let history = useHistory();

  useEffect(() => {
    const value = localStorage.getItem("emailForRegistration");

    setEmail(value ? value : "");
  }, [history]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validação
    if (!email || !password) {
      toast.error("Entre com email e senha", {
        autoClose: 5000,
      });
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      // console.log(result);
      if (result.user?.emailVerified) {
        window.localStorage.removeItem("emailForRegistration");

        let user = auth.currentUser;

        await user?.updatePassword(password);
      }
    } catch (err) {
      console.log("Erro na validação do registro", err.messagem);
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Acessando...</h4>
      ) : (
        <h4>Registrar</h4>
      )}

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
            disabled
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
          disabled={!email || loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CompleteRegistration;
