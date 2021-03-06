import React, { useContext } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

import { AuthContext } from '../context/AuthContext';

interface IPost {
  id: number;
  title: string;
  description: string;
}

const GET_ALL_POSTS = gql`
  {
    allPosts {
      id
      title
      description
    }
  }
`;

const Home: React.FC = () => {
  const { data, loading } = useQuery(GET_ALL_POSTS);
  const [fetchPosts, { data: posts }] = useLazyQuery(GET_ALL_POSTS);

  // Access context
  const { state, dispatch } = useContext(AuthContext);

  const updateUserName = () => {
    dispatch({
      type: 'LOGGED_IN_USER',
      user: {
        email: 'Paulo Roberto',
        token: '',
      },
    });
  };

  if (loading) return <p className="p-5">Carregando...</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {data
          && data.allPosts.map((post: IPost) => (
            <div className="col-md-4" key={post.id}>
              <div className="card">
                <div className="card-body">
                  <div className="card-title">
                    <h4>{post.title}</h4>
                  </div>
                  <p className="card-text">{post.description}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="row p-5">
        <button
          type="button"
          onClick={() => fetchPosts()}
          className="btn-btn-raised btn-primary"
        >
          Buscar posts
        </button>
      </div>
      <hr />
      {JSON.stringify(posts)}
      <hr />
      {JSON.stringify(state.user)}
      <hr />
      <button type="button" onClick={updateUserName} className="btn btn-primary">
        Change user name
      </button>
    </div>
  );
};

export default Home;
