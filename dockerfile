FROM node:18-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY  ./app.sh  ./

EXPOSE 4000

RUN chmod +x app.sh

CMD [ "./app.sh" ]