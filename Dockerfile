FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
ENV HOSTNAME=0.0.0.0 PORT=8000
CMD ["node", "src/index.ts"]
