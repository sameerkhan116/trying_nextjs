/*
  Require graphql and compose to wrap the react components asking for graphql queries.
   With this, we get graphql functions such as fetchMore, subscribeToMore etc on the component.data
  gql neended to write graphql queries.
*/
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

// with data for link configuration that we set up for subscriptions
import withData from '../lib/apollo';

// here we write the allUsers and Subscription Queries
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

/*
  by wrapping this component in multiple graphql queries (using compose) we now have the
  subscribeToMore option available on it. We can run the subscribeToMore function on componentMount
  and add the new user coming in to the list of all previous users.
*/
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

// using composes to wrap index with multiple graphql queries
const graphqlIndex = compose(graphql(SUBSCRIPTIONS), graphql(ALL_USERS))(Index);

export default withData(graphqlIndex);