import React, { FormEvent, useState } from "react";

import { auth } from "../../firebase";

import AuthForm from "../../components/forms/AuthForm";
import { toast } from "react-toastify";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await auth.currentUser
      ?.updatePassword(password)
      .then(() => {
        setLoading(false);

        toast.success(
          `Senha do usuário ${auth.currentUser?.email} atualizada com sucesso`
        );
      })
      .catch((err) => {
        setLoading(false);
        console.log("Ocorreu um erro ao atualizar senha", err);

        toast.error(
          `Erro ao atualizar senha do usuário ${auth.currentUser?.email}! Contate o administrador.`
        );
      });
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Acessando...</h4>
      ) : (
        <h4>Atualizando senha</h4>
      )}

      <AuthForm
        password={password}
        setPassword={setPassword}
        loading={loading}
        handleSubmit={handleSubmit}
        showPasswordInput
        hideEmailInput={true}
      />
    </div>
  );
};

export default PasswordUpdate;
