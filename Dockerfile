FROM node:18

WORKDIR /usr/src/net-snmp-bot-tl
RUN apt-get update && apt-get install -y 

COPY package.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]

