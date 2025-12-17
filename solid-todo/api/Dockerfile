ARG NODE_VERSION=22-alpine
ARG NGINX_VERSION=alpine3.22
ARG PORT=6299
# ============================================
# Stage 1: Base - Common dependencies
# ============================================
FROM node:${NODE_VERSION} AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . . 

ENV PORT=$PORT
EXPOSE $PORT

# ============================================
# Stage 2: Development - Hot reload with devtools
# ============================================
FROM base AS development

ENTRYPOINT ["npm", "run", "start"]

# ============================================
# Stage 3: Test - Run unit tests
# ============================================
# FROM base AS test

# ENTRYPOINT ["npm", "run", "test"]


# ============================================
# Stage 4: Build - Create production instance
# ============================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /usr/src/app
ENV PORT=$PORT
ENV NODE_ENV production
EXPOSE $PORT

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci --only=production --quiet

COPY . . 

ENTRYPOINT ["node", "app.js"]
