import React, { FormEvent, useState } from "react";

import AuthForm from "../../components/forms/AuthForm";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {};

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
