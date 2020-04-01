# Stage 1:
# To Install Dependencies including DevDependencies
# Other Build files to Build the app

FROM node:10 AS builder

# Working directory at Container
WORKDIR /usr/app

# install dependencies with cache
COPY package*.json ./
# install all Dependencies including DevDependencies
RUN npm install

# copy local files, build
COPY . .
RUN npm run build


# Stage 2:
# Install only dependencies and remove unnessery files, packages
FROM node:10-alpine

# Working directory for compiled app
WORKDIR /usr/app

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

# RUN echo "Running docker env ======== $NODE_ENV"

# Install deps for production only
COPY package*.json ./
COPY pm2.yaml ./
RUN npm install -g pm2
RUN npm install --production

# Install pm2
RUN npm install pm2 -g

# Copy builded source from the upper builder stage
COPY --from=builder /usr/app/dist ./dist

# Expose port
EXPOSE 6064

# Start Application using pm2
CMD ["sh", "-c", "pm2-runtime start pm2.yaml --env $NODE_ENV"]
