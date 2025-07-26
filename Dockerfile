FROM node:22-alpine

WORKDIR /app  
COPY package*.json . 
RUN ["npm", "ci"]

ENV NODE_ENV=production

COPY . .
COPY wait-for.sh /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for

EXPOSE 8080

USER node
CMD ["sh", "-c", "wait-for db:3306 -- node src/server.js"]