import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// context auth link:
const authLink = setContext((_, { headers }) => {
  let token = null;
  const auth = localStorage.getItem('auth');
  if (auth) {
    const authDtl = JSON.parse(auth);
    token = authDtl.access_token;
  }

  // Return the headers to the context, including the authorization token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Accept-Encoding': 'gzip'
    },
  };
});

const httpLink = new HttpLink({ uri: 'http://localhost:8000/graphql' });
const link = ApolloLink.from([authLink, httpLink]);

export const httpClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});
