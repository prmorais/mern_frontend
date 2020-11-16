import React, { ChangeEvent, FormEvent } from "react";

interface IProps {
	email?: string;
	password?: string;
	loading: boolean;
	setEmail?: (valor: string) => void;
	setPassword?: (valor: string) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	showPasswordInput: boolean;
	showEmailInput: boolean;
}

const AuthForm = ({
	email = "",
	password = "",
	loading,
	setEmail = (f) => f,
	setPassword,
	handleSubmit,
	showPasswordInput = false,
	showEmailInput = false,
}: IProps) => {
	return (
		<form onSubmit={handleSubmit}>
			{showEmailInput && (
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
			)}

			{showPasswordInput && (
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						className="form-control"
						value={password}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setPassword && setPassword(e.target.value);
						}}
						placeholder="Entre com a Senha"
						disabled={loading}
					/>
				</div>
			)}

			<button
				className="btn btn-raised btn-primary"
				disabled={
					showPasswordInput && showEmailInput
						? !email || !password || loading
						: showPasswordInput ?
							!password || loading
							: !email || loading
				}
			>
				Submit
      </button>
		</form>
	);
};

export default AuthForm;
