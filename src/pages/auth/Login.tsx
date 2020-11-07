import React, { ChangeEvent, useState } from 'react';

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [loading] = useState<boolean>(false);

	const handleSubmit = () => {

	}

	return (
		<div className="container p-5">
			<h4>Login</h4>
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

export default Login; 