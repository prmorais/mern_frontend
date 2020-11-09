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

    // const result = await auth.sendSignInLinkToEmail(email, config);
    // console.log("Result", result);

    // Exibe notificação para o usuário sobre o email enviado
    toast.success(
      `Email enviado para ${email}. Clique no link para completar seu registro.`,
      {
        autoClose: 5000,
      }
    );

    // Salva o email no local storage
    localStorage.setItem("emailForRegistration", email);

    // Limpa o state
    setEmail("");
    setLoading(false);
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
