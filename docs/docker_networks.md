# Docker Networks - Multi-Service Summary

## The Problem
When you run multiple containers on the same host, they need to communicate with each other (e.g., frontend → backend → database).

## The Solution: Docker Networks

**Docker networks allow containers to communicate by name instead of IP addresses.**

## Basic Example

```bash
# Create a custom network
docker network create myapp-network

# Run database on the network
docker run -d \
  --name postgres-db \
  --network myapp-network \
  postgres:15

# Run backend on the same network
docker run -d \
  --name backend \
  --network myapp-network \
  -e DATABASE_URL=postgresql://postgres-db:5432/mydb \
  my-backend-image

# Run frontend on the same network
docker run -d \
  --name frontend \
  --network myapp-network \
  -e API_URL=http://backend:3000 \
  -p 80:80 \
  my-frontend-image
```

**Key points:**
- Containers on the same network can reach each other by **container name**
- Backend connects to database using `postgres-db:5432` (not IP address)
- Frontend connects to backend using `http://backend:3000`
- Only frontend needs `-p` to expose ports to the host

## Docker Compose (Preferred Method)

```yaml
# docker-compose.yml
version: '3.8'

services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD: secret
    # No ports exposed to host - only accessible within network

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://database:5432/mydb
    depends_on:
      - database
    # Accessible to frontend as 'backend'

  frontend:
    build: ./frontend
    environment:
      API_URL: http://backend:3000
    ports:
      - "80:80"
    depends_on:
      - backend

# Docker Compose automatically creates a network for all services
```

```bash
docker-compose up -d
```

## Network Types

**1. Bridge (default)** - Most common, isolated network
```bash
docker network create myapp-network
```

**2. Host** - Container uses host's network directly (no isolation)
```bash
docker run --network host my-image
```

**3. None** - No networking
```bash
docker run --network none my-image
```

## Common Patterns

**Multiple networks for security:**
```yaml
services:
  frontend:
    networks:
      - public
  
  backend:
    networks:
      - public
      - private
  
  database:
    networks:
      - private  # Only backend can access

networks:
  public:
  private:
```

**Connect existing container to network:**
```bash
docker network connect myapp-network existing-container
```

**Inspect network:**
```bash
docker network inspect myapp-network
```

## Real-World Example

```yaml
version: '3.8'

services:
  nginx:
    image: nginx
    ports:
      - "80:80"
    networks:
      - frontend

  api:
    build: ./api
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    networks:
      - frontend
      - backend

  postgres:
    image: postgres:15
    networks:
      - backend
    volumes:
      - db-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    networks:
      - backend

networks:
  frontend:  # nginx ↔ api
  backend:   # api ↔ postgres, redis

volumes:
  db-data:
```

**Benefits:**
- ✅ Service discovery by name (no hardcoded IPs)
- ✅ Isolation between services
- ✅ Easy to scale and replace containers
- ✅ Security through network segmentation
- ✅ Works on single host or Swarm/Kubernetes

**Key takeaway:** Docker networks make multi-container apps work seamlessly by providing DNS-based service discovery.

# hostname resolution for module federation

## Build Time vs Runtime

**At build time, you can use:**

1. **Hardcoded URLs** (simplest, but inflexible)
```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    app1: 'app1@http://localhost:3001/remoteEntry.js',
    app2: 'app2@https://app2.example.com/remoteEntry.js'
  }
})
```

2. **Placeholder/promise-based resolution** (runtime flexibility)
```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    app1: 'app1@http://localhost:3001/remoteEntry.js',
    // Will be resolved at runtime
  }
})
```

## Dynamic Runtime Resolution (Recommended)

You can resolve remote URLs at **runtime** based on environment, config, or API calls:

**Method 1: Using `init` and `get` manually**

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {} // Empty! Will load dynamically
})
```

```javascript
// At runtime in your app
async function loadRemoteComponent(remoteUrl, scope, module) {
  await __webpack_init_sharing__('default');
  
  const container = await import(/* webpackIgnore: true */ remoteUrl);
  await container.init(__webpack_share_scopes__.default);
  
  const factory = await container.get(module);
  return factory();
}

// Usage
const RemoteButton = await loadRemoteComponent(
  'http://dynamic-host:3001/remoteEntry.js',
  'app1',
  './Button'
);
```

**Method 2: Dynamic remotes with promise**

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    app1: `promise new Promise(resolve => {
      const remoteUrl = window.ENV.APP1_URL || 'http://localhost:3001/remoteEntry.js';
      const script = document.createElement('script');
      script.src = remoteUrl;
      script.onload = () => {
        resolve({
          get: (request) => window.app1.get(request),
          init: (arg) => window.app1.init(arg)
        });
      };
      document.head.appendChild(script);
    })`
  }
})
```

**Method 3: External remotes config (cleanest)**

```javascript
// remotes.config.js (loaded at runtime)
export default {
  app1: process.env.REACT_APP_APP1_URL || 'http://localhost:3001/remoteEntry.js',
  app2: process.env.REACT_APP_APP2_URL || 'http://localhost:3002/remoteEntry.js'
};
```

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {}, // Will be populated at runtime
  shared: ['react', 'react-dom']
})
```

```javascript
// In your app
import remoteConfig from './remotes.config';

const loadComponent = (remoteName, componentPath) => {
  return React.lazy(async () => {
    const remoteUrl = remoteConfig[remoteName];
    // Load remote dynamically
    return import(/* webpackIgnore: true */ `${remoteUrl}${componentPath}`);
  });
};
```

## Docker/Kubernetes Example

This is especially useful with Docker where service names resolve at runtime:

```javascript
// webpack.config.js (build time - no specific URLs)
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    app1: 'app1@[window.remoteUrls.app1]/remoteEntry.js'
  }
})
```

```javascript
// index.html (injected at container start)
<script>
  window.remoteUrls = {
    app1: 'http://app1-service:3001' // Docker service name
  };
</script>
```

```yaml
# docker-compose.yml
services:
  host:
    build: ./host
    environment:
      - APP1_URL=http://app1-service:3001
    ports:
      - "3000:3000"
  
  app1-service:
    build: ./app1
    ports:
      - "3001:3001"
```

## Environment-based Resolution

```javascript
// .env.development
REACT_APP_REMOTE_APP1=http://localhost:3001/remoteEntry.js

// .env.production
REACT_APP_REMOTE_APP1=https://app1.prod.example.com/remoteEntry.js

// .env.staging
REACT_APP_REMOTE_APP1=https://app1.staging.example.com/remoteEntry.js
```

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    app1: `app1@${process.env.REACT_APP_REMOTE_APP1}`
  }
})
```

## Summary

**Build time:**
- ❌ Don't need resolved hostnames
- ✅ Can use placeholders, environment variables, or promises
- ✅ Same build works in dev, staging, production

**Runtime:**
- ✅ Resolve actual URLs based on environment
- ✅ Load from Docker service names, Kubernetes services, or CDNs
- ✅ Change remotes without rebuilding

**Best practice:** Use environment variables or runtime config to make your build environment-agnostic!