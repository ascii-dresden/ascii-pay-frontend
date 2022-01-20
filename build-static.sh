#!/bin/bash

SERVER_BIN="$1";

git reset --hard
git clean -xdf

yarn install

${SERVER_BIN} graphql > schema.graphql

yarn schema:generate
yarn build --offline
