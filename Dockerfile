# for live editing
FROM node
WORKDIR /usr/src/app/my-app
COPY package*.json ./
RUN npm install
EXPOSE 5173
CMD ["npm", "start"]