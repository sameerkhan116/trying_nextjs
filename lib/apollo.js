/*
  Using withData library from next-apollo required for setting up reliable graphql server
  with next.js.
  Also required websocket for websocket socket implementation.
*/

import {split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import {withData} from 'next-apollo';
import {setContext} from 'apollo-link-context';
import ws from 'websocket';

// the uri and subscriptionUri (they are seperate endpoints)
const uri = 'http://localhost:4000/graphql';
const subscriptionUri = 'ws://localhost:4000/subscriptions';

// create new HttpLink for normal queries and mutations
const httpLink = new HttpLink({uri, credentials: 'same-origin'});

// setup websocket link using WebSocketLink library frmo apollo-link-ws. it
// takes uri, websocketImplementation and other options as arguments
const wsLink = new WebSocketLink({
  uri: subscriptionUri,
  options: {
    reconnect: true
  },
  webSocketImpl: ws.client
})

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  return {
    headers: {
      ...headers,
      "x-token": token,
      "x-refresh-token": refreshToken
    }
  }
})

const totLink = authLink.concat(httpLink);

// the final link setup, so that subscriptions and other http operations are
// split accordingly
const link = split(({query}) => {
  const {kind, operation} = getMainDefinition(query);
  return kind == 'OperationDefinition' && operation === 'subscription'
}, wsLink, totLink)

// the final config object required by withData will take this link as args
const config = {
  link,
  opts: {
    credentials: 'same-origin'
  }
}

export default withData(config);