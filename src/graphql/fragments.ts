import { gql } from '@apollo/client';

export const USER_INFO = gql`
  fragment userInfo on User {
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
`;
