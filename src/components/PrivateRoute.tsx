import React, { useContext, useEffect, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const PrivateRouter = ({ children, ...rest }: any) => {
	const { state } = useContext(AuthContext);
	const [user, setUser] = useState(false);

	useEffect(() => {
		if (state.user) {
			setUser(true);
		}
	}, [state.user]);

	const navLinks = () => (
		<nav>
			<ul className="nav flex-column">
				<li className="nav-item">
					<Link to="/update/profile" className="nav-link">
						Profile
					</Link>
				</li>

				<li className="nav-item">
					<Link to="/update/password" className="nav-link">
						Password
					</Link>
				</li>

				<li className="nav-item">
					<Link to="/create/post" className="nav-link">
						Post
					</Link>
				</li>
			</ul>
		</nav>
	);

	const renderContent = () => (
		<div className="container-fluid pt-5">
			<div className="row">
				<div className="col-md-4">
					{navLinks()}
				</div>
				<div className="col-md-8">
					<Route {...rest} />
				</div>
			</div>
		</div>
	);

	return user ? renderContent() : <h4>Carregando...</h4>;
}

export default PrivateRouter;