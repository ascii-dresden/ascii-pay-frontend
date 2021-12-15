module.exports = {
  client: {
    service: {
      name: 'ascii-pay-server',
      url: 'https://pay.ascii.coffee/api/v1/graphql',
      headers: {
        'user-agent': 'JS GraphQL',
      },
    },
    includes: ['src/graphql.ts'],
  },
};
