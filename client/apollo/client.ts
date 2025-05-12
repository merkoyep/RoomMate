import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const SERVER_URL = 'http://10.88.111.7:4000';

const httpLink = createHttpLink({
  uri: `${SERVER_URL}/graphql`,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
