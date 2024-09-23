import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const httpLink = new HttpLink({ uri: import.meta.env.VITE_API_URL });
const link = ApolloLink.from([httpLink]);

export const httpClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});
