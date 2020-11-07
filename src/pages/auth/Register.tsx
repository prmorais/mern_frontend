import React, { ChangeEvent, FormEvent, useState } from 'react';

import { auth } from '../../firebase'

const Register: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const config = {
			url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT || '',
			handleCodeInApp: true
		}

		const result = await auth.sendSignInLinkToEmail(email, config);
		console.log('Result', result);

		// Exibe notificação para o usuário sobre o email enviado

		// Salva o email no local storage
		localStorage.setItem('emailFormRegistration', email);

		// Limpa o state
		setEmail('');
		setLoading(false);

	}

	return (
		<div className="container p-5">
			<h4>Registrar</h4>
			<form onSubmit={handleSubmit} >
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						className="form-control"
						value={email}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
						placeholder="Entre com o e-mail"
						disabled={loading}
					/>
				</div>
				<button className="btn btn-raised btn-primary"
					disabled={!email || loading} >
					Submit
							</button>
			</form>
		</div>
	);
}

export default Register;