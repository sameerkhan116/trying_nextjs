import Head from 'next/head';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/apollo';

const ALL_USERS = gql `
  {
    allUsers {
      id
      username
    }
  }
`;

const auth = ({data, loading}) => {
  if(loading) {
    return <div>Loading...</div>
  }
  return (
  <div>
    <ul>
      {data.allUsers.map(u => <li key={u.id}>{u.username}</li>)}
    </ul>
  </div>
  )
};

export default withData(graphql(ALL_USERS)(auth));
