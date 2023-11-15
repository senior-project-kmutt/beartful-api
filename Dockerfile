FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
RUN npm run build
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
