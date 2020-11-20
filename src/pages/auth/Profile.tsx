import { useMutation, useQuery } from "@apollo/client";
import React, {
	ChangeEvent,
	FormEvent,
	// useContext,
	useMemo,
	useState,
} from "react";

import { toast } from "react-toastify";
import omitDeep from "omit-deep-lodash";

import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
// import { AuthContext } from "../../context/authContext";
import {
	IProfile,
	IProfileResp,
} from "../../interfaces/Profile.interface";
import UserProfile from "../../components/forms/UserProfile";
import FileUpload from "../../components/FileUpload";

const Profile = () => {
	// const { state } = useContext(AuthContext);
	const [values, setValues] = useState<IProfile>({
		username: "",
		name: "",
		email: "",
		about: "",
		images: [{ url: "", public_id: "" }],
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



	return (
		<div className="container p-5">
			<div className="row">
				<div className="col-md-12 pb-3">
					{loading ? (
						<h4 className="text-danger">Acessando...</h4>
					) : (
							<h4>Perfil</h4>
						)}
				</div>

				<div className="col-md-3">

					<FileUpload
						setValues={setValues}
						setLoading={setLoading}
						values={values}
						loading={loading}
					/>

				</div>
				<div className="col-md-9">
					{images.map((image) => (
						<img
							src={image.url}
							key={image.public_id}
							alt={image.public_id}
							style={{ height: "100px" }}
							className="float-right"
						// onClick={() => handleImageRemove(image.public_id)}
						/>
					))}
				</div>
			</div>

			<UserProfile
				{...values}
				handleSubmit={handleSubmit}
				handleChange={handleChange}
				loading={loading}
			/>
		</div>
	);
};

export default Profile;
