# APIdog Quick Reference Card

## Setup (2 minutes)

### 1. Import Collections
```bash
# File: apidog-collection.json
# Contains: All 50+ API endpoints with OpenAPI 3.0 spec
```

### 2. Set Environments
- **Local**: http://localhost:5173
- **Prod**: https://api.abayasstore.com

### 3. Create Variables
- `base_url` = http://localhost:5173
- `admin_token` = (from login)
- `customer_token` = (from login)
- `product_id` = (from product creation)
- `order_id` = (from order creation)

---

## Core API Endpoints

### Authentication
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/admin/auth/login` | POST | None | Admin login |
| `/api/customer/auth/signup` | POST | None | Create account |
| `/api/customer/auth/login` | POST | None | Customer login |

### Products
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/products` | GET | None | List all products |
| `/api/products/{id}` | GET | None | Get product details |
| `/api/admin/products` | POST | Admin | Create product |
| `/api/admin/products/{id}` | PUT | Admin | Update product |
| `/api/admin/products/{id}` | DELETE | Admin | Delete product |

### Cart
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/cart` | GET | None | View cart |
| `/api/cart` | POST | None | Add item |
| `/api/cart/{id}` | PUT | None | Update quantity |
| `/api/cart/{id}` | DELETE | None | Remove item |
| `/api/cart/clear` | POST | None | Clear all items |

### Orders
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/customer/orders` | GET | Customer | My orders |
| `/api/customer/orders/create` | POST | None | Create order |
| `/api/admin/orders` | GET | Admin | All orders |
| `/api/admin/orders/{id}/status` | PUT | Admin | Update status |
| `/api/admin/orders/{id}/tracking` | PUT | Admin | Add tracking |

### Admin Dashboard
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/admin/dashboard/stats` | GET | Admin | Overview stats |
| `/api/admin/inventory/stats` | GET | Admin | Stock levels |
| `/api/admin/orders/stats/summary` | GET | Admin | Order metrics |
| `/api/admin/customers/stats/summary` | GET | Admin | Customer metrics |

---

## Test Workflow

### Step 1: Login
```json
POST /api/admin/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```
**Save token** → `admin_token` variable

### Step 2: Create Product
```json
POST /api/admin/products
Authorization: Bearer {{admin_token}}
{
  "name": "Black Abaya",
  "price": 89.99,
  "stock": 100
}
```
**Save ID** → `product_id` variable

### Step 3: Add to Cart
```json
POST /api/cart
{
  "productId": "{{product_id}}",
  "quantity": 2
}
```

### Step 4: Create Order
```json
POST /api/customer/orders/create
{
  "items": [{"productId": "{{product_id}}", "quantity": 2}],
  "total": 179.98
}
```
**Save ID** → `order_id` variable

### Step 5: Update Order (Admin)
```json
PUT /api/admin/orders/{{order_id}}/status
Authorization: Bearer {{admin_token}}
{
  "status": "processing"
}
```

---

## Common Test Scenarios

### Scenario 1: Customer Journey (5 steps)
1. Customer Login ✓
2. View Products ✓
3. Add to Cart ✓
4. Create Order ✓
5. View My Orders ✓

### Scenario 2: Admin Product Management (6 steps)
1. Admin Login ✓
2. Create Product ✓
3. Update Product Price ✓
4. Check Stock ✓
5. Bulk Update Stock ✓
6. Export Products ✓

### Scenario 3: Order Fulfillment (4 steps)
1. Admin Login ✓
2. Get All Orders ✓
3. Update Status → "shipped" ✓
4. Add Tracking Number ✓

### Scenario 4: Inventory Check (3 steps)
1. Admin Login ✓
2. Get Low Stock Items ✓
3. Adjust Stock ✓

---

## Error Codes & Fixes

| Code | Meaning | Fix |
|------|---------|-----|
| 401 | Unauthorized | Check Bearer token |
| 403 | Forbidden | Check admin role |
| 404 | Not Found | Verify ID exists |
| 422 | Invalid Data | Check request body |
| 500 | Server Error | Check backend logs |

---

## Authorization Levels

### Admin Only
- Delete products
- Delete customers
- Delete admin users
- Audit logs

### Admin/Manager
- Create orders
- Update inventory
- Update prices
- Update order status

### Admin/Editor
- Create products
- Update products
- Add product tags

### All Authenticated
- View profile
- View orders
- Update own profile

### Public (No Auth)
- List products
- Get product details
- View cart
- Create contact form

---

## Variable Management

### Auto-Save Variables (Built into Test Suite)
```javascript
// After Admin Login
pm.environment.set('admin_token', jsonData.token);

// After Product Creation
pm.environment.set('product_id', jsonData.id);

// After Order Creation
pm.environment.set('order_id', jsonData.id);
```

### Manual Variables
```
base_url = http://localhost:5173
auth_token = [from response]
```

---

## Tips & Tricks

### 1. Test Authentication First
Always run login endpoints before protected routes

### 2. Use Variables
Never hardcode IDs - use `{{product_id}}` format

### 3. Chain Tests
Use post-request scripts to auto-save response data

### 4. Validate Responses
Enable schema validation for all endpoints

### 5. Check Logs
View Backend logs when tests fail

### 6. Use Collections
Group tests by feature (Auth, Products, Orders, etc.)

### 7. Monitor Performance
Track response times for optimization

### 8. Version Control
Keep apidog-collection.json in git

---

## Files Created

### 1. `apidog-collection.json` (50+ endpoints)
OpenAPI 3.0 specification with:
- All request/response schemas
- Security definitions (Bearer token)
- Environment variables
- Example payloads

### 2. `apidog-tests.json` (7 test groups)
Pre-built test cases with:
- Chained requests (login → create → update)
- Auto-save variables
- Test assertions
- Error handling

### 3. `APIDOG_SETUP_GUIDE.md`
Complete documentation with:
- Import instructions
- Environment setup
- Test workflows
- Troubleshooting

---

## Next Steps

1. **Import Files**
   - Open APIdog
   - Import `apidog-collection.json`

2. **Set Environments**
   - Dev: http://localhost:5173
   - Prod: https://api.abayasstore.com

3. **Run Tests**
   - Start with Authentication Tests
   - Follow each scenario

4. **Save Tokens**
   - Login to get JWT tokens
   - Tests auto-save to variables

5. **Monitor Results**
   - Check response codes
   - Review response bodies
   - Validate schemas

---

## Support Resources

- **Backend Logs**: Check `/Backend` logs for errors
- **Database**: Verify Prisma schema in `/prisma`
- **Routes**: All routes in `/Backend/routes`
- **Auth**: Check `/Backend/auth` for security

---

**Created**: November 21, 2025
**API Version**: 1.0.0
**Collection Version**: 1.0.0
