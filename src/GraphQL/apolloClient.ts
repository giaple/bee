import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { API_GRAPHQL } from '@env'

// Initialize Apollo Client
const client = new ApolloClient({
  uri: `${process.env.API_URL}/graphql`,
  // cache: new InMemoryCache()
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchJob: {
            keyArgs: false,
            merge(existing, incoming, options) {
              if (!existing) return incoming;
              if (!incoming || !incoming?.data?.records?.length)
                return existing;
              if (existing && incoming)
                return {
                  ...existing,
                  data: {
                    ...existing.data,
                    records: [
                      ...existing.data.records,
                      ...incoming.data.records,
                    ],
                  },
                };
            },
          },
        },
      },
    },
  }),
});
export default client;
