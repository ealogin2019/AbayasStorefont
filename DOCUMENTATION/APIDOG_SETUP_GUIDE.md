# APIdog Setup & Test Suite Guide

## Overview
This document explains how to use the APIdog collection and test suite for your Abayas Storefront project.

## Files Created

### 1. **apidog-collection.json**
Complete OpenAPI 3.0 specification with all 50+ endpoints documented including:
- **Health & Utilities**: Ping, Demo, Contact endpoints
- **Products**: Public CRUD operations
- **Cart**: Add, update, remove, clear cart items
- **Customer Auth**: Signup, Login, Profile management
- **Customer Orders**: Create orders, view order history
- **Admin Auth**: Admin login and profile
- **Admin Dashboard**: Statistics and metrics
- **Admin Products**: Full CRUD with bulk operations
- **Admin Orders**: Manage orders, tracking, status
- **Admin Customers**: View customer details and stats
- **Admin Inventory**: Stock management and monitoring
- **Admin Settings**: Configuration management
- **Admin Users**: Admin/Manager/Editor/Viewer role management
- **Audit Logs**: Activity tracking and compliance

## How to Import into APIdog

### Method 1: Direct Import
1. Open APIdog
2. Click **File → Import**
3. Select **apidog-collection.json**
4. The entire collection will be imported with all paths organized by tags

### Method 2: From URL
1. Copy the full path: `d:\Abaya\AbayasStorefont\apidog-collection.json`
2. In APIdog, use Import from File option
3. Select and import

## Environment Setup in APIdog

Create two environments in APIdog:

### Development Environment
```
Base URL: http://localhost:5173
Variables:
- auth_token: (leave empty initially)
- admin_token: (leave empty initially)
- customer_token: (leave empty initially)
```

### Production Environment
```
Base URL: https://api.abayasstore.com
Variables:
- auth_token: (from login response)
- admin_token: (from admin login response)
- customer_token: (from customer login response)
```

## Testing Workflow

### Phase 1: Authentication Testing
1. **Admin Login**
   - POST `/api/admin/auth/login`
   - Body: `{ "email": "admin@example.com", "password": "password" }`
   - Copy token from response to `admin_token` variable

2. **Customer Signup**
   - POST `/api/customer/auth/signup`
   - Body: `{ "email": "customer@example.com", "password": "password", "firstName": "John", "lastName": "Doe" }`
   - Copy token to `customer_token` variable

### Phase 2: Product Management Testing
1. **Create Product** (Requires admin_token)
   - POST `/api/admin/products`
   - Add Bearer token from admin_token

2. **List Products** (Public)
   - GET `/api/products`
   - No authentication needed

3. **Get Single Product**
   - GET `/api/products/{id}` (replace {id} with actual product ID)

### Phase 3: Cart & Checkout Testing
1. **Add to Cart**
   - POST `/api/cart`
   - Body: `{ "productId": "uuid-here", "quantity": 1 }`

2. **Update Cart Item**
   - PUT `/api/cart/{id}`
   - Body: `{ "quantity": 2 }`

3. **View Cart**
   - GET `/api/cart`

### Phase 4: Order Testing
1. **Create Order**
   - POST `/api/customer/orders/create`
   - Requires auth token (customer_token)

2. **View Orders** (Customer)
   - GET `/api/customer/orders`
   - Requires auth token

3. **Admin Order Management**
   - GET `/api/admin/orders` (list all orders)
   - PUT `/api/admin/orders/{id}/status` (update status)
   - PUT `/api/admin/orders/{id}/tracking` (add tracking number)

## Pre-configured Requests & Tests

### Setting Bearer Token Automatically
For all protected endpoints, set the Authorization header to:
```
Authorization: Bearer {{admin_token}}
```
or
```
Authorization: Bearer {{customer_token}}
```

APIdog will automatically substitute the variables.

## Common Test Scenarios

### Scenario 1: Complete Customer Journey
```
1. Customer Signup
2. Get Customer Profile
3. Add Product to Cart
4. View Cart
5. Create Order from Cart
6. View Order History
```

### Scenario 2: Admin Product Management
```
1. Admin Login
2. Create Product
3. List Products
4. Update Product
5. Get Product Details
6. Bulk Update Stock
7. Bulk Update Price
8. Export Products to CSV
```

### Scenario 3: Inventory Monitoring
```
1. Admin Login
2. Check Low Stock Items
3. Check Out of Stock Items
4. Adjust Product Stock
5. View Inventory Stats
```

### Scenario 4: Order Management
```
1. Admin Login
2. List All Orders
3. Get Order Details
4. Update Order Status
5. Update Tracking Number
6. View Order Statistics
```

## Authentication Details

### Admin Roles
- **admin**: Full access to all endpoints
- **manager**: Can create/update orders and inventory
- **editor**: Can create/update products
- **viewer**: Read-only access

### Customer Authentication
- Signup creates new account and returns JWT token
- Login returns JWT token for subsequent requests
- Token required for profile, orders, and checkout operations

## Error Testing

### Common Error Scenarios to Test
1. **401 Unauthorized**: Missing or invalid auth token
2. **403 Forbidden**: Insufficient role permissions
3. **404 Not Found**: Invalid product/order/customer ID
4. **422 Validation Error**: Invalid request body
5. **500 Server Error**: Backend issues

## Performance Testing with APIdog

1. Use **Batch Requests** to test multiple endpoints sequentially
2. Use **Load Testing** (if available) to test under load
3. Monitor response times for each endpoint
4. Check for N+1 query problems in list endpoints

## Integrating with CI/CD

The `apidog-collection.json` can be used with:
- **Postman/Newman**: Convert or import directly
- **GitHub Actions**: Automated API testing
- **GitLab CI**: Pipeline integration
- **Jenkins**: Test automation

## Example Test Script (for CI/CD)

```bash
# Run APIdog collection tests
apidog test --collection apidog-collection.json \
  --environment development \
  --iteration 1
```

## Tips & Best Practices

1. **Use Variables**: Store base URLs, tokens, and IDs as variables
2. **Test Authentication First**: Always verify auth before testing protected endpoints
3. **Mock Data**: Use the `/api/demo` endpoint for test data
4. **Validate Response Schemas**: Enable schema validation for all endpoints
5. **Monitor Logs**: Check backend logs when tests fail
6. **Version Control**: Keep apidog-collection.json in git for tracking changes
7. **Documentation**: Keep API docs updated with collection changes

## Troubleshooting

### Token Invalid/Expired
- Re-login using the authentication endpoint
- Copy the new token to environment variables

### 404 on Product Operations
- Ensure product ID is valid and exists in database
- Check ID format (should be UUID)

### CORS Errors
- Verify CORS is properly configured on backend
- Check origin settings in `/api` configuration

### File Upload Issues
- Ensure file size is under 5MB
- Use supported formats: JPEG, PNG, GIF, WEBP

## Next Steps

1. ✅ Import `apidog-collection.json` into APIdog
2. ✅ Create two environments (dev and production)
3. ✅ Test authentication endpoints first
4. ✅ Run through Phase 1-4 tests
5. ✅ Set up automated test runs
6. ✅ Configure CI/CD integration
7. ✅ Share with team for collaborative testing

---

**Last Updated**: November 21, 2025
**API Version**: 1.0.0
