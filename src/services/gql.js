import { httpClient } from '../apolloClient';

const handleErr = (error) => {
  throw new Error(error.graphQLErrors[0].message)
}

export const mutation = async (schema, variables) => {
  try {
    const { data } = await httpClient.mutate({
      mutation: schema,
      variables,
      fetchPolicy: 'no-cache',
    });

    return data;
  } catch (error) {
    handleErr(error);
  }
}

export const query = async (schema, variables) => {
  try {
    const { data } = await httpClient.query({
      query: schema,
      variables,
      fetchPolicy: 'no-cache',
    });

    return data;
  } catch (error) {
    handleErr(error);
  }
}