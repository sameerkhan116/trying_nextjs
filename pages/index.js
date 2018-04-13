import {graphql, compose, Query, Subscription} from 'react-apollo';
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

const SUBSCRIPTIONS = gql `
  subscription {
    userAdded {
      id
      username
    }
  }
`;

class Index extends React.Component {
  componentDidMount() {
    this
      .props
      .data
      .subscribeToMore({
        document: SUBSCRIPTIONS,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) {
            return prev;
          }
          const newUser = subscriptionData.data.userAdded;
          return {
            ...prev,
            allUsers: [
              newUser, ...prev.allUsers
            ]
          }
        }
      })
  }

  render() {
    const {
      allUsers = []
    } = this.props.data;

    return (
      <div>Welcome to next.js!
        <ul>
          {allUsers.map(u => <li key={u.id}>{u.username}</li>)}
        </ul>
      </div>
    )
  }
}

const graphqlIndex = compose(graphql(SUBSCRIPTIONS), graphql(ALL_USERS))(Index);

export default withData(graphqlIndex);