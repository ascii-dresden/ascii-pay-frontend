FROM node:16.13 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:1.21-alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
