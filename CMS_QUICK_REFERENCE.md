# 🚀 CMS Quick Reference Guide

## Getting Started

### 1. Create First Admin
```bash
curl -X POST http://localhost:8080/api/admin/auth/create-admin \
  -H "Content-Type: application/json" \
  -d {
    \"email\": \"admin@store.com\",
    \"password\": \"SecurePassword123!\",
    \"firstName\": \"Admin\",
    \"lastName\": \"User\"
  }'
```

### 2. Login to Admin Panel
Visit: `http://localhost:8080/admin/login`

### 3. Access Dashboard
`http://localhost:8080/admin`

---

## API Endpoints Quick Reference

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/auth/login` | Login & get JWT token |
| POST | `/api/admin/auth/create-admin` | Create admin account |
| GET | `/api/admin/auth/profile` | Get current admin profile |

### Products Management
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/products` | ✅ | List products (paginated) |
| GET | `/api/admin/products/:id` | ✅ | Get single product |
| POST | `/api/admin/products` | ✅ Editor+ | Create product |
| PUT | `/api/admin/products/:id` | ✅ Editor+ | Update product |
| DELETE | `/api/admin/products/:id` | ✅ Admin | Delete product |

### Orders Management
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/orders` | ✅ | List orders (filtered by status) |
| GET | `/api/admin/orders/:id` | ✅ | Get order details |
| PUT | `/api/admin/orders/:id/status` | ✅ Manager+ | Update order status |
| GET | `/api/admin/orders/stats/summary` | ✅ | Order statistics |

### Customers Management
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/customers` | ✅ | List customers |
| GET | `/api/admin/customers/:id` | ✅ | Get customer details & history |
| GET | `/api/admin/customers/stats/summary` | ✅ | Customer statistics |

### Dashboard
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/dashboard/stats` | Get dashboard metrics |

---

## Authentication

All admin endpoints require JWT token in header:
```
Authorization: Bearer {your-jwt-token}
```

Get token from login response:
```bash
curl -X POST http://localhost:8080/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@store.com",
    "password": "SecurePassword123!"
  }'

# Response:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGc...",
#     "admin": { ... }
#   }
# }
```

---

## User Roles & Permissions

| Role | Products | Orders | Customers | Delete |
|------|----------|--------|-----------|--------|
| **Admin** | Create, Edit, Delete | Full Access | Full Access | ✅ |
| **Editor** | Create, Edit | View, Update Status | View | ❌ |
| **Manager** | View | View, Update Status | View | ❌ |

---

## Creating a Plugin

### 1. Create Plugin File
```typescript
// server/plugins/my-plugin.ts
import { Plugin } from "@shared/plugins";

const myPlugin: Plugin = {
  name: "My Plugin",
  version: "1.0.0",
  type: "data", // data, service, dashboard, integration
  description: "Does something awesome",
  
  // Optional: Settings configurable in admin
  settings: [
    {
      key: "enabled",
      label: "Enable Feature",
      type: "boolean",
      default: true
    }
  ],
  
  // Optional: Initialize when plugin loads
  initialize: async () => {
    console.log("My plugin initialized!");
  },
  
  // Hooks available:
  onProductCreate: async (product) => {
    // Runs when product is created
  },
  
  onOrderShip: async (order) => {
    // Runs when order is shipped
  },
  
  onSchedule: async () => {
    // Runs periodically (implement cron job)
  },
};

export default myPlugin;
```

### 2. Register in Server
```typescript
// server/index.ts
import myPlugin from "./plugins/my-plugin.js";

export async function createServer() {
  // ...
  pluginManager.registerPlugin(myPlugin);
  await pluginManager.initializeAll();
  // ...
}
```

---

## Available Plugin Hooks

```typescript
// Product Hooks
onProductCreate(product: Product)
onProductUpdate(product: Product, oldProduct?: Product)
onProductDelete(productId: string)

// Order Hooks
onOrderCreate(order: Order & { items: OrderItem[] })
onOrderUpdate(order: Order, status: string)
onOrderShip(order: Order)
onOrderDeliver(order: Order)
onOrderCancel(order: Order)

// Lifecycle
initialize()        // Runs at startup
onSchedule()        // Background tasks
```

---

## Common Tasks

### Create a Product via API
```bash
curl -X POST http://localhost:8080/api/admin/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Abaya",
    "description": "Beautiful black abaya",
    "price": 45.99,
    "currency": "GBP",
    "image": "https://example.com/image.jpg",
    "thumbnail": "https://example.com/thumb.jpg",
    "colors": ["black", "navy"],
    "sizes": ["S", "M", "L", "XL"],
    "quantity": 50,
    "inStock": true,
    "tags": ["premium", "sale"]
  }'
```

### Update Order Status
```bash
curl -X PUT http://localhost:8080/api/admin/orders/{orderId}/status \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "notes": "Shipped via DPD"
  }'
```

### Search Products
```bash
curl "http://localhost:8080/api/admin/products?search=abaya&page=1&limit=10" \
  -H "Authorization: Bearer {token}"
```

---

## Frontend Usage

### useAdmin Hook
```typescript
import { useProtectedAdmin, useAdminAuth } from "@/hooks/useAdmin";

export default function MyAdminPage() {
  // Redirects to login if not authenticated
  useProtectedAdmin();
  
  // Or use auth utilities
  const { getToken, getUser, logout } = useAdminAuth();
  
  const token = getToken();  // Get JWT token
  const user = getUser();    // Get user info
  
  // Make API calls
  const response = await fetch("/api/admin/products", {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

---

## File Structure

```
📁 server/
  📁 auth/
    ├── utils.ts          # JWT, passwords
    └── middleware.ts     # Auth guards
  📁 plugins/
    └── manager.ts        # Plugin system core
  📁 routes/admin/
    ├── auth.ts           # Login endpoints
    ├── products.ts       # Product CRUD
    ├── orders.ts         # Order management
    ├── customers.ts      # Customer info
    └── dashboard.ts      # Stats

📁 client/
  📁 pages/
    ├── AdminLogin.tsx
    ├── AdminDashboard.tsx
    └── AdminProducts.tsx
  📁 components/admin/
    └── AdminLayout.tsx
  📁 hooks/
    └── useAdmin.ts       # Auth utilities

📁 shared/
  └── plugins.ts          # Plugin interfaces
```

---

## Troubleshooting

### "Invalid Token" Error
- Token expired (7 days) → Re-login
- Wrong secret in `.env` → Check `JWT_SECRET`
- Token not sent in header → Use `Authorization: Bearer {token}`

### "Not Found" on `/api/admin/*`
- Server not started → Run `pnpm dev`
- Wrong URL → Check endpoint spelling
- Missing `/api` prefix → All admin routes start with `/api/admin/`

### Plugin Not Running
- Not registered → Add to `pluginManager.registerPlugin()`
- Initialization failed → Check console logs
- Wrong hook name → Use exact names from `Plugin` interface

---

## Environment Variables

```bash
# JWT configuration
JWT_SECRET=change-this-in-production

# Database
DATABASE_URL=file:./dev.db

# Server
PORT=8080
NODE_ENV=development
```

---

## Database Models

### Admin
```prisma
model Admin {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String    // Hashed
  firstName String?
  lastName  String?
  role      String    @default("editor")  // admin, editor, manager
  active    Boolean   @default(true)
  lastLogin DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

---

## Performance Tips

1. **Pagination** - Use `page` and `limit` parameters
2. **Search** - Use `search` parameter for filtering
3. **Token Caching** - Store token in localStorage
4. **API Calls** - Batch requests when possible
5. **Database** - Indexes on frequently queried fields

---

## Security Checklist

- ✅ Use `HTTPS` in production
- ✅ Keep `JWT_SECRET` secret
- ✅ Rotate tokens periodically
- ✅ Validate all inputs (Zod schemas in place)
- ✅ Use RBAC for sensitive operations
- ✅ Log audit trail (AuditLog model)
- ✅ Enable CORS only for trusted domains
- ✅ Rate limiting on login endpoint (recommended)

---

## Next Steps

1. Create admin account
2. Log in to admin panel
3. Create some test products
4. Create test orders
5. Explore dashboard metrics
6. Build first plugin
7. Deploy to production

**Happy building! 🚀**
