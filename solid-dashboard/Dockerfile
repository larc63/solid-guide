ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22
ARG PORT=6300
# ============================================
# Stage 1: Base - Common dependencies
# ============================================
FROM node:${NODE_VERSION} AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . . 

# ============================================
# Stage 2: Development - Hot reload with devtools
# ============================================
FROM base AS development

EXPOSE $PORT

ENTRYPOINT ["npm", "run", "dev"]

# ============================================
# Stage 3: Test - Run unit tests
# ============================================
# FROM base AS test

# ENTRYPOINT ["npm", "run", "test"]


# ============================================
# Stage 4: Build - Create production instance
# ============================================
FROM base AS builder

RUN npm run build

# Deployment phase 
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/dist/* /usr/share/nginx/html

EXPOSE $PORT

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
