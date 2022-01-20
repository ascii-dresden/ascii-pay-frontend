module.exports = {
  client: {
    service: {
      name: 'ascii-pay-server',
      localSchemaFile: './schema.graphql',
    },
    includes: ['src/graphql.ts'],
  },
};
