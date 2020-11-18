import { gql, useMutation, useQuery } from '@apollo/client';
import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { toast } from 'react-toastify';

interface IProfile {
	username: string,
	name: string,
	email: string,
	about: string,
	images: string[],
}

interface IProfileResp {
	profile: IProfile,
}

const PROFILE = gql`
	query {
		profile {
			_id
			username
			name
			email
			images {
				url
				public_id
			}
			about
			createdAt
			updatedAt
		}
	}
`;

const USER_PROFILE = gql`
	mutation userUpdate($input: UserUpdateInput!) {
		userUpdate(input: $input) {
			_id
			username
			name
			email
			images {
				url
				public_id
			}
			about
			createdAt
			updatedAt
		}
	}
`;

const Profile = () => {
	const [values, setValues] = useState<IProfile>({
		username: '',
		name: '',
		email: '',
		about: '',
		images: [],
	});

	const [loading, setLoading] = useState(false);

	const { data } = useQuery<IProfileResp>(PROFILE);

	useMemo(() => {
		data &&
			setValues({
				...values,
				username: data.profile.username,
				name: data.profile.name,
				email: data.profile.email,
				about: data.profile.about,
				images: data.profile.images,
			})
	}, [data, values]);

	// Mutation
	const [userUpdate] = useMutation(USER_PROFILE, {
		update: ({ data }: any) => {
			console.log('Atualização de usuário na mutation profile', data);

			toast.success('Perfil do usuário foi atualizado.');
		}
	});

	// Destructure
	const { about, email, images, name, username } = values;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// console.log(values);

		setLoading(true);
		userUpdate({ variables: { input: values } });
		setLoading(false);
	};

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const handleImageChange = () => {

	}

	const profileUpdateForm = () => (
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
					className="form-control" />
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
					className="form-control" />
			</div>

			<div className="form-group">
				<label>E-mail</label>
				<input
					name="email"
					value={email}
					onChange={handleChange}
					placeholder="Email"
					disabled={loading}
					type="text"
					className="form-control" />
			</div>

			<div className="form-group">
				<label>Imagem</label>
				<input
					name="image"
					// value={images}
					onChange={handleImageChange}
					placeholder="Imagens"
					type="file"
					accept="image/*"
					className="form-control" />
			</div>

			<div className="form-group">
				<label>Sobre</label>
				<textarea
					name="about"
					value={about}
					onChange={handleChange}
					placeholder="Sobre"
					disabled={loading}
					className="form-control" />
			</div>
			<button
				type="submit"
				disabled={!email || loading}
				className="btn btn-primary">Enviar</button>
		</form>
	)

	return (
		<div className="container p-5">
			{profileUpdateForm()}
		</div>
	)
}

export default Profile



