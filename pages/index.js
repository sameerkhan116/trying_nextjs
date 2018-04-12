import withData from '../lib/apollo';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const query = gql `
  {
    allUsers {
      id
      username
    }
  }
`;

const index = ({data: {
    allUsers
  }}) => (
  <div>
    Welcome to next.js!
    <ul>
      {allUsers.map(u => <li key={u.id}>{u.username}</li>)}
    </ul>
  </div>
);

const graphqlIndex = graphql(query)(index);

export default withData(graphqlIndex);