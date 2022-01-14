#!/bin/bash

SERVER_BIN="$1";

git reset --hard
git clean -xdf

yarn install

cat > apollo.config.js << EOL
module.exports = {
    client: {
    service: {
        name: 'ascii-pay-server',
        localSchemaFile: './schema.graphql'
    },
    includes: ['src/graphql.ts'],
    },
};
EOL
${SERVER_BIN} graphql > schema.graphql

yarn schema:generate
yarn build --offline
