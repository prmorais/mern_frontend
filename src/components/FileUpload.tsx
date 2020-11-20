import React, { ChangeEvent, useContext } from 'react'
import Resizer from 'react-image-file-resizer';

import axios from 'axios';

import { toast } from 'react-toastify';

import { IFileUpload, IImage } from '../interfaces/Profile.interface';
import { AuthContext } from '../context/authContext';

export const FileUpload = (
	{ setValues, setLoading, values, loading }: IFileUpload
) => {
	const { state } = useContext(AuthContext);
	const { images } = values;

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
			.then((response) => {
				setLoading(false);

				let filteredImages = images.filter((item) => {
					return item.public_id !== id;
				});

				setValues({ ...values, images: filteredImages });
			})
			.catch((err) => {
				setLoading(false);

				toast.error("Erro ao remover imagem!");
			});
	};

	const fileResizeAndUpload = (event: ChangeEvent<any>) => {
		setLoading(true);

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
				"base64"
			);
		}
	};
	return (
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
	);
};

export default FileUpload;
