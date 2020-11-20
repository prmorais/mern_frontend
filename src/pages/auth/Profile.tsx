import { useMutation, useQuery } from "@apollo/client";
import React, {
	ChangeEvent,
	FormEvent,
	useContext,
	useMemo,
	useState,
} from "react";

import axios from "axios";
import Resizer from "react-image-file-resizer";

import { toast } from "react-toastify";
import omitDeep from "omit-deep-lodash";

import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import { AuthContext } from "../../context/authContext";

interface IImage {
	url: string;
	public_id: string;
}

interface IProfile {
	username: string;
	name: string;
	email: string;
	about: string;
	images: Array<IImage>;
}

interface IProfileResp {
	profile: IProfile;
}

const Profile = () => {
	const { state } = useContext(AuthContext);
	const [values, setValues] = useState<IProfile>({
		username: "",
		name: "",
		email: "",
		about: "",
		images: [{ url: '', public_id: '' }],
	});

	const [loading, setLoading] = useState(false);

	const { data } = useQuery<IProfileResp>(PROFILE);

	useMemo(() => {
		// Inicio da gambiarra
		let images: any;

		if (data) {
			// Retira o campo __typename da resposta
			images = omitDeep(data.profile.images, "__typename");
		}
		// fim da gambiarra

		data &&
			setValues({
				username: data.profile.username,
				name: data.profile.name,
				email: data.profile.email,
				about: data.profile.about,
				images,
			});
	}, [data]);

	// Mutation
	const [userUpdate] = useMutation(USER_UPDATE, {
		update: ({ data }: any) => {
			// console.log("Atualização de usuário na mutation profile", data);

			toast.success(`Perfil de <<${values.email}>> atualizado.`);
		},
	});

	// Destructure
	const { about, email, images, name, username } = values;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoading(true);
		userUpdate({ variables: { input: values } });
		setLoading(false);
	};

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const handleImageRemove = (id: string) => {
		setLoading(true);

		axios
			.post(
				`${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
				{ public_id: id },
				{
					headers: {
						authorization: state.user.token,
					},
				}
			)
			.then(response => {
				setLoading(false);

				let filteredImages = images.filter(item => {
					return item.public_id !== id;
				});

				setValues({ ...values, images: filteredImages });
			})
			.catch(err => {
				setLoading(false);

				toast.error('Erro ao remover imagem!');
			})
	}

	const fileResizeAndUpload = (event: ChangeEvent<any>) => {
		let fileInput = false;

		if (event.target.files[0]) {
			fileInput = true;
		}

		if (fileInput) {
			Resizer.imageFileResizer(
				event.target.files[0],
				300,
				300,
				"JPEG",
				100,
				0,
				(uri) => {
					axios
						.post<IImage>(
							`${process.env.REACT_APP_REST_ENDPOINT}/uploadimage`,
							{ image: uri },
							{
								headers: {
									authorization: state.user.token,
								},
							}
						)
						.then((response) => {
							setLoading(false);
							// console.log("Upload para Cloudinary", response);
							setValues({ ...values, images: [...images, response.data] });
						})
						.catch((err) => {
							setLoading(false);
							console.log("Upload para cloudinary falhou!");
						});
				},
				'base64'
			);
		}
	};

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

	return (
		<div className="container p-5">
			<div className="row">
				<div className="col-md-3">
					<div className="form-group">
						<label className="btn btn-primary">
							Upload de Imagem
						<input
								hidden
								onChange={fileResizeAndUpload}
								placeholder="Imagens"
								type="file"
								accept="image/*"
								className="form-control"
							/>
						</label>
					</div>
				</div>
				<div className="col-md-9">
					{
						images.map(image => (
							<img
								src={image.url}
								key={image.public_id}
								alt={image.public_id}
								style={{ height: '100px' }}
								className="float-right"
								onClick={() => handleImageRemove(image.public_id)}
							/>
						))
					}
				</div>
			</div>

			{profileUpdateForm()}

		</div>
	);
};

export default Profile;
