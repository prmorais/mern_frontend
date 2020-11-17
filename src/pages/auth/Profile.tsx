import { gql, useQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react'

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
				username: data.profile.username,
				name: data.profile.name,
				email: data.profile.email,
				about: data.profile.about,
				images: data.profile.images,
			})
	}, [data])

	return (
		<div className="container p-5">
			{ JSON.stringify(values)}
		</div>
	)
}

export default Profile



