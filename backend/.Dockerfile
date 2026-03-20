# --------- BUILD STAGE ---------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# install exact dependencies
RUN npm ci

COPY . .

# build typescript
RUN npm run build


# --------- PRODUCTION STAGE ---------
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# install only production deps
RUN npm ci --omit=dev

# copy built files
COPY --from=builder /app/dist ./dist

# set production mode
ENV NODE_ENV=production

EXPOSE 5000

# run app
CMD ["node", "dist/server.js"]