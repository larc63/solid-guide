Here's a complete setup for running Angular with live reload in Docker:

## 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 4200
EXPOSE 4200

# Start ng serve with host binding and polling for file changes
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
```

## 2. docker-compose.yml

```yaml
version: '3.8'

services:
  angular-app:
    build: .
    container_name: angular-dev
    ports:
      - "4200:4200"
    volumes:
      # Mount source code for live reload
      - .:/app
      # Prevent node_modules from being overwritten
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: ng serve --host 0.0.0.0 --poll 2000 --disable-host-check
```

## 3. .dockerignore

```
node_modules
dist
.git
.gitignore
README.md
.angular
.vscode
*.log
```

## 4. Commands to Run

```bash
# Build and start the container
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Rebuild after Dockerfile changes
docker-compose up --build

# Execute commands inside the running container
docker-compose exec angular-app ng generate component my-component

# Install new npm packages
docker-compose exec angular-app npm install package-name
```

## 5. Alternative: Simpler docker-compose.yml (No Dockerfile)

```yaml
version: '3.8'

services:
  angular-app:
    image: node:18-alpine
    container_name: angular-dev
    working_dir: /app
    ports:
      - "4200:4200"
    volumes:
      - .:/app
      - /app/node_modules
    command: sh -c "npm install -g @angular/cli && npm install && ng serve --host 0.0.0.0 --poll 2000 --disable-host-check"
    environment:
      - NODE_ENV=development
```

## 6. Enhanced docker-compose.yml (with hot reload optimization)

```yaml
version: '3.8'

services:
  angular-app:
    build: .
    container_name: angular-dev
    ports:
      - "4200:4200"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.angular
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true
      - CHOKIDAR_INTERVAL=1000
    command: ng serve --host 0.0.0.0 --poll 2000 --disable-host-check --live-reload
    stdin_open: true
    tty: true
```

## 7. Multi-stage Dockerfile (Development + Production)

```dockerfile
# Development stage
FROM node:18-alpine AS development

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]

# Production build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN ng build --configuration production

# Production serve stage
FROM nginx:alpine AS production

COPY --from=build /app/dist/your-app-name /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 8. docker-compose for Multi-stage

```yaml
version: '3.8'

services:
  # Development
  angular-dev:
    build:
      context: .
      target: development
    container_name: angular-dev
    ports:
      - "4200:4200"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  # Production
  angular-prod:
    build:
      context: .
      target: production
    container_name: angular-prod
    ports:
      - "8080:80"
    profiles:
      - production
```

Run development:
```bash
docker-compose up angular-dev
```

Run production:
```bash
docker-compose --profile production up angular-prod
```

## 9. Makefile (Optional - for convenience)

```makefile
# Makefile
.PHONY: up down build logs shell install

up:
	docker-compose up

down:
	docker-compose down

build:
	docker-compose up --build

logs:
	docker-compose logs -f

shell:
	docker-compose exec angular-app sh

install:
	docker-compose exec angular-app npm install $(pkg)

generate:
	docker-compose exec angular-app ng generate $(type) $(name)
```

Usage:
```bash
make up
make logs
make install pkg=lodash
make generate type=component name=header
```

## 10. Key Points for Live Reload

**Why `--poll 2000`?**
- Docker volumes on Mac/Windows don't trigger native file system events
- Polling checks for file changes every 2 seconds
- Adjust value based on project size (larger = less frequent checks)

**Why `--host 0.0.0.0`?**
- Binds to all network interfaces
- Without it, Angular only listens on localhost inside the container
- Makes the app accessible from your host machine

**Why `--disable-host-check`?**
- Disables host checking for webpack dev server
- Prevents "Invalid Host header" errors
- Only use in development, not production

**Volume mounting `/app/node_modules`:**
- Prevents host's node_modules from overwriting container's
- Container uses its own installed dependencies
- Keeps host and container dependencies separate

## Troubleshooting

**Changes not reflecting?**
```bash
# Increase poll interval
ng serve --host 0.0.0.0 --poll 500

# Enable verbose logging
ng serve --host 0.0.0.0 --poll 2000 --verbose

# Clear Angular cache
docker-compose exec angular-app rm -rf .angular
```

**Port already in use?**
```yaml
ports:
  - "4201:4200"  # Change host port
```

**Permission issues on Linux?**
```bash
# Run with current user
docker-compose run --user $(id -u):$(id -g) angular-app ng serve
```

This setup gives you full hot-reload capabilities with your Angular app running in Docker!