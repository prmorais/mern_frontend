import React, {
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { toast } from 'react-toastify';

import AuthForm from '../../components/forms/AuthForm';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase';

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

const CompleteRegistration: React.FC = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    const value = localStorage.getItem('emailForRegistration');

    setEmail(value || '');
  }, [history]);

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validação
    if (!email || !password) {
      toast.error('Entre com email e senha', {
        autoClose: 5000,
      });
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href,
      );
      // console.log(result);
      if (result.user?.emailVerified) {
        // Remove o email do localstorage
        window.localStorage.removeItem('emailForRegistration');

        const user = auth.currentUser;

        await user?.updatePassword(password);

        // "Despacha" usuario com token e email, para em seguinda, redirecionar
        // const idTokenResult = await user?.getIdTokenResult();

        // dispatch({
        //   type: 'LOGGED_IN_USER',
        //   user: {
        //     email: user.email,
        //     token: idTokenResult?.token,
        //   },
        // });

        if (user) {
          const idTokenResult = await user?.getIdTokenResult();

        dispatch({
          type: 'LOGGED_IN_USER',
          user: {
            email: user.email,
            token: idTokenResult?.token,
          },
        });
        }

        // Faz uma requisição a API para salvar/atualizar o usuário no mmongodb
        userCreate();

        history.push('/profile');
      }
    } catch (err) {
      console.log('Erro na validação do registro', err.messagem);
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Acessando...</h4>
      ) : (
          <h4>Complete seu registro</h4>
        )}

      <AuthForm
        email={email}
        password={password}
        loading={loading}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        showPasswordInput
        showEmailInput
      />
    </div>
  );
};

export default CompleteRegistration;
