import React, { FormEvent, useState } from "react"

import { toast } from "react-toastify";

import { auth } from "../../firebase";

import AuthForm from "../../components/forms/AuthForm";


const PasswordForgot = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const config = {
			url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT || "",
			handleCodeInApp: true,
		};

		console.log(email + ' - ' + config.url)
		await auth.sendPasswordResetEmail(email, config)
			.then(() => {
				setLoading(false);
				setEmail('');

				// Exibe notificação para o usuário sobre o email enviado
				toast.success(
					`Email enviado para ${email}. Clique no link para fazer criar uma nova senha`,
					{
						autoClose: 5000,
					}
				);

			}).catch(err => {
				setLoading(false);
				console.log('Erro ao enviar e-mail', err);

				// Exibe notificação de erro para o usuário
				toast.error(
					`Erro ao enviar e-mail para: ${email}`,
					{
						autoClose: 5000,
					}
				);

			});
	}

	return (
		<div className="container p-5">
			{loading ?
				<h4 className="text-danger">Acessando...</h4> :
				<h4>Esqueci a senha</h4>}

			<AuthForm
				email={email}
				loading={loading}
				setEmail={setEmail}
				handleSubmit={handleSubmit}
				showPasswordInput={false}
			/>
		</div>
	)
}

export default PasswordForgot