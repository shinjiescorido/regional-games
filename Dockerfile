FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
#COPY ./sequelize ./node_modules/sequelize
EXPOSE 8000
CMD [ "npm", "start" ]
