FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

#CMD ["node", "build"]
CMD ["npm", "run", "preview"]
