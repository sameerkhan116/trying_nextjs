import {split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import {withData} from 'next-apollo';
import ws from 'websocket';

const uri = 'http://localhost:4000/graphql';
const subscriptionUri = 'ws://localhost:4000/subscriptions';

const httpLink = new HttpLink({uri});

const wsLink = new WebSocketLink({
  uri: subscriptionUri,
  options: {
    reconnect: true
  },
  webSocketImpl: ws.client
})

const link = split(({query}) => {
  const {kind, operation} = getMainDefinition(query);
  return kind == 'OperationDefinition' && operation === 'subscription'
}, wsLink, httpLink)

const config = {
  link,
  opts: {
    credentials: 'same-origin'
  }
}

export default withData(config);