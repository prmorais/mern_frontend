import React from "react";
import { IUserProfile } from "../../interfaces/Profile.interface";

const UserProfile = ({
	username,
	name,
	email,
	about,
	handleChange,
	handleSubmit,
	loading,
}: IUserProfile) => {
	return (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label>Nome do Usuário</label>
				<input
					name="username"
					value={username}
					onChange={handleChange}
					placeholder="Nome do usuário"
					disabled={loading}
					type="text"
					className="form-control"
				/>
			</div>

			<div className="form-group">
				<label>Nome</label>
				<input
					name="name"
					value={name}
					onChange={handleChange}
					placeholder="Nome"
					disabled={loading}
					type="text"
					className="form-control"
				/>
			</div>

			<div className="form-group">
				<label>E-mail</label>
				<input
					name="email"
					value={email}
					onChange={handleChange}
					placeholder="Email"
					disabled
					type="text"
					className="form-control"
				/>
			</div>

			<div className="form-group">
				<label>Sobre</label>
				<textarea
					name="about"
					value={about}
					onChange={handleChange}
					placeholder="Sobre"
					disabled={loading}
					className="form-control"
				/>
			</div>
			<button
				type="submit"
				disabled={!email || loading}
				className="btn btn-primary"
			>
				Salvar
      </button>
		</form>
	);
};

export default UserProfile;
