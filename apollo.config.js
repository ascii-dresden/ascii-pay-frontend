module.exports = {
  client: {
    service: {
      name: 'ascii-pay-server',
      url: 'http://localhost:8080/api/v1/graphql',
      headers: {
        'user-agent': 'JS GraphQL',
      },
    },
    includes: ['src/graphql.ts'],
  },
};
