import React, { FC, FormEvent, useState } from 'react';

import { toast } from 'react-toastify';
import { auth } from '../../firebase';

import AuthForm from '../../components/forms/AuthForm';

const PasswordUpdate: FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser?.email?.split('@')[0];

    await auth.currentUser
      ?.updatePassword(password)
      .then(() => {
        setLoading(false);

        toast.success(
          `Senha do usuário <${user}> foi atualizada.`,
        );
      })
      .catch((err) => {
        setLoading(false);
        // console.log("Ocorreu um erro ao atualizar senha", err);
        if (err.code === 'auth/weak-password') {
          toast.error(
            'A Senha deve conter no mínimo 6 caracteres!',
          );
        } else if (err.code === 'auth/requires-recent-login') {
          toast.error(
            'Faça login e tente novamente!',
          );
        } else {
          toast.error(
            'Erro ao atualizar senha! Contate o administrador.',
          );
        }
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
        showEmailInput={false}
      />
    </div>
  );
};

export default PasswordUpdate;
