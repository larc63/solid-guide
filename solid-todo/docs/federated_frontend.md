**Each component gets provisioned to its own server** - Module Federation is explicitly designed to avoid monoliths!

**How it works:**

```
┌─────────────────┐         ┌─────────────────┐
│   Host App      │         │   Remote App 1  │
│   localhost:3000│◄────────│   localhost:3001│
│                 │  fetch  │                 │
│  - Shell/Layout │  at     │  - Header       │
│  - Routing      │ runtime │  - User Profile │
└─────────────────┘         └─────────────────┘
         │
         │ fetch at runtime
         ▼
┌─────────────────┐
│   Remote App 2  │
│   localhost:3002│
│                 │
│  - Dashboard    │
│  - Analytics    │
└─────────────────┘
```

**Key points:**

1. **Separate builds**: Each app is built and deployed independently
2. **Runtime loading**: The host fetches remote modules at runtime via HTTP
3. **Independent deployment**: You can update Remote App 1 without rebuilding the host
4. **Separate servers**: Each app runs on its own server/port/domain

**Example deployment:**

```
Host:     https://main-app.com
Remote 1: https://header-service.com
Remote 2: https://dashboard-service.com
```

**In the host app:**

```javascript
// webpack.config.js (Host)
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    header: 'header@https://header-service.com/remoteEntry.js',
    dashboard: 'dashboard@https://dashboard-service.com/remoteEntry.js'
  }
})
```

**Using remote components:**

```typescript
// Host app dynamically loads from remote servers
const Header = lazy(() => import('header/Header'));
const Dashboard = lazy(() => import('dashboard/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />  {/* Loaded from header-service.com */}
      <Dashboard />  {/* Loaded from dashboard-service.com */}
    </Suspense>
  );
}
```

**Benefits:**

- ✅ Independent deployments (update header without touching host)
- ✅ Different teams can own different remotes
- ✅ Smaller bundle sizes (code splitting across servers)
- ✅ Technology agnostic (remotes can use different React versions)
- ✅ True micro-frontends

**NOT a monolith** - it's the opposite! Each remote is a separate application that the host discovers and loads at runtime.