import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react'

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
	const [values, setValues] = useState({
		username: '',
		name: '',
		email: '',
		about: '',
		images: [],
	});

	const [loading, setLoading] = useState(false);

	const { data } = useQuery(PROFILE);

	return (
		<div className="container p-5">
			{ JSON.stringify(data)}
		</div>
	)
}

export default Profile



