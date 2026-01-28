ARG NODE_VERSION=24.7.0-alpine
ARG NGINX_VERSION=alpine3.22

# ============================================
# Stage 1: Base - Common dependencies
# ============================================
FROM node:${NODE_VERSION} AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci
RUN npm i baseline-browser-mapping@latest -D

COPY . . 

RUN npm run ng analytics disable -- --global

# ============================================
# Stage 2: Development - Hot reload with devtools
# ============================================
FROM base AS development

EXPOSE 4200

# ENTRYPOINT ["npm", "run", "start"]

# ============================================
# Stage 3: Test - Run unit tests
# ============================================
FROM base AS test

ENTRYPOINT ["npm", "run", "test"]


# ============================================
# Stage 4: Build - Create production instance
# ============================================
FROM base AS builder

RUN npm run build

# Deployment phase 
FROM nginx:trixie-perl AS runner
# FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# USER nginx

COPY nginx.conf /etc/nginx/nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx --from=builder /app/dist/*/browser /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
# ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]

