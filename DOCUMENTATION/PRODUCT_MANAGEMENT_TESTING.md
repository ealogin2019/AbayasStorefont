# 🧪 PRODUCT MANAGEMENT - COMPLETE TESTING GUIDE

**Date**: November 15, 2025  
**Status**: All components ready for testing  
**Test Scenarios**: 30+

---

## ✅ Pre-Test Setup

### Prerequisites
```
1. Run development server
   $ pnpm dev
   → Should start on http://localhost:8080

2. Create admin account (if not already done)
   $ curl -X POST http://localhost:8080/api/admin/auth/create-admin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@test.com",
       "password": "AdminPass123!"
     }'

3. Login at http://localhost:8080/admin/login
   → Use email/password from step 2

4. Navigate to /admin/products
   → Should see Products page (empty or with products)
```

---

## 🧪 Test Scenarios

### Test Suite 1: Create Product

#### Test 1.1: Create Product - Happy Path
```
Steps:
  1. Navigate to /admin/products
  2. Click "Add Product" button
  3. Fill form:
     - Name: "Black Premium Abaya"
     - Description: "High-quality black abaya"
     - Price: 475
     - Currency: AED
  4. Upload main image (any JPG/PNG)
  5. Upload thumbnail
  6. Add color: "Black"
  7. Add size: "S"
  8. Add tag: "summer"
  9. Set quantity: 50
  10. Check "In Stock"
  11. Click "Create Product"

Expected Results:
  ✅ Form submits
  ✅ Redirect to /admin/products
  ✅ New product appears in list
  ✅ Product has all entered data
  ✅ Success message shows (optional toast)

Verify in Database:
  $ sqlite3 dev.db "SELECT id, name, price FROM Product;"
  → Should include new product
```

#### Test 1.2: Create Product - Validation Error
```
Steps:
  1. Navigate to /admin/products/new
  2. Leave Name field empty
  3. Try to submit form

Expected Results:
  ✅ Error message: "Product name is required"
  ✅ Form not submitted
  ✅ Button still clickable
```

#### Test 1.3: Create Product - Invalid Price
```
Steps:
  1. Navigate to /admin/products/new
  2. Enter Name: "Test Product"
  3. Enter Price: -100 (negative)
  4. Try to submit

Expected Results:
  ✅ Error message: "Price must be positive"
  ✅ Form not submitted
```

#### Test 1.4: Create Product - No Colors
```
Steps:
  1. Navigate to /admin/products/new
  2. Fill all fields
  3. Skip colors (don't add any)
  4. Try to submit

Expected Results:
  ✅ Warning: "Add at least one color option"
  ✅ Form not submitted
```

#### Test 1.5: Create Product - No Sizes
```
Steps:
  1. Navigate to /admin/products/new
  2. Fill all fields with colors
  3. Skip sizes (don't add any)
  4. Try to submit

Expected Results:
  ✅ Warning: "Add at least one size option"
  ✅ Form not submitted
```

#### Test 1.6: Create Product - Duplicate Name
```
Steps:
  1. Create product with name "Unique Name"
  2. Navigate to /admin/products/new
  3. Enter same name "Unique Name"
  4. Try to submit

Expected Results:
  ✅ Error: "Product with this name already exists"
  ✅ Form not submitted
```

#### Test 1.7: Create Product - Cancel
```
Steps:
  1. Navigate to /admin/products/new
  2. Fill some fields (optional)
  3. Click "Cancel" button

Expected Results:
  ✅ Redirect to /admin/products
  ✅ Product not created
  ✅ Form data discarded
```

---

### Test Suite 2: Read/List Products

#### Test 2.1: List Products - Display
```
Prerequisites:
  - At least 3 products in database

Steps:
  1. Navigate to /admin/products

Expected Results:
  ✅ Products display in table
  ✅ Shows: Name, Price, Stock, Status, Created, Actions
  ✅ Each product has Edit and Delete buttons
  ✅ "Add Product" button visible
  ✅ Search bar visible
```

#### Test 2.2: List Products - Pagination
```
Prerequisites:
  - At least 15 products in database

Steps:
  1. Navigate to /admin/products
  2. Note current page (should be 1)
  3. Click "Next" button
  4. Should show page 2

Expected Results:
  ✅ Page changes to 2
  ✅ Different products displayed
  ✅ Pagination info shows: "Page 2 of X"
  ✅ "Previous" button enabled
  ✅ Can click Previous to go back
```

#### Test 2.3: List Products - Search
```
Prerequisites:
  - Products: "Black Abaya", "Navy Abaya", "Red Dress"

Steps:
  1. Navigate to /admin/products
  2. Click search box
  3. Type "abaya"
  4. Wait for results

Expected Results:
  ✅ Table updates immediately
  ✅ Shows only "Black Abaya" and "Navy Abaya"
  ✅ "Red Dress" hidden
  ✅ Result count accurate
```

#### Test 2.4: List Products - Empty Search
```
Steps:
  1. Navigate to /admin/products
  2. Search for "nonexistent123"

Expected Results:
  ✅ Table shows: "No products found"
  ✅ Pagination hidden
  ✅ Can still click to create new
```

#### Test 2.5: Get Single Product
```
Steps:
  1. Navigate to /admin/products
  2. Click Edit on a product
  3. Should navigate to /admin/products/:id

Expected Results:
  ✅ Form loads with product data
  ✅ All fields populated correctly
  ✅ Page title: "Edit Product"
```

---

### Test Suite 3: Update Product

#### Test 3.1: Update Product - Happy Path
```
Steps:
  1. Navigate to /admin/products
  2. Click Edit on any product
  3. Change price: 500 → 600
  4. Add new color: "Maroon"
  5. Click "Update Product"

Expected Results:
  ✅ Form submits
  ✅ Redirect to /admin/products
  ✅ Product list shows new price (600)
  ✅ Product still has new color
  ✅ All other data intact
```

#### Test 3.2: Update Product - Partial Update
```
Steps:
  1. Navigate to /admin/products
  2. Click Edit on any product
  3. Change ONLY the description
  4. Don't change anything else
  5. Click "Update Product"

Expected Results:
  ✅ Form submits
  ✅ Only description updated
  ✅ Price stays same
  ✅ Stock stays same
  ✅ Other fields unchanged
```

#### Test 3.3: Update Product - Change Name
```
Steps:
  1. Navigate to /admin/products
  2. Click Edit on "Product A"
  3. Change name to "Product B"
  4. Click "Update Product"

Expected Results:
  ✅ Form submits
  ✅ Product list shows new name
  ✅ No duplicate key error
  ✅ Search finds by new name
```

#### Test 3.4: Update Product - Images
```
Steps:
  1. Navigate to /admin/products
  2. Click Edit on any product
  3. Click "X" on main image
  4. Upload new image
  5. Click "Update Product"

Expected Results:
  ✅ Old image removed
  ✅ New image displayed
  ✅ Product updated in database
  ✅ Changes persist after refresh
```

#### Test 3.5: Update Product - Array Fields
```
Steps:
  1. Navigate to /admin/products
  2. Click Edit on any product
  3. Remove a color by clicking "×"
  4. Add a new color
  5. Remove a size
  6. Add a new size
  7. Click "Update Product"

Expected Results:
  ✅ Form submits
  ✅ New colors reflect in product
  ✅ New sizes reflect in product
  ✅ Removed items gone
```

#### Test 3.6: Update Product - Validation
```
Steps:
  1. Navigate to /admin/products
  2. Click Edit on any product
  3. Clear Name field
  4. Try to submit

Expected Results:
  ✅ Error message shows
  ✅ Form not submitted
```

---

### Test Suite 4: Delete Product

#### Test 4.1: Delete Product - Happy Path
```
Steps:
  1. Navigate to /admin/products
  2. Click Delete button on a product
  3. Confirmation dialog appears
  4. Click "OK" to confirm

Expected Results:
  ✅ Confirmation dialog shows
  ✅ Product removed from list
  ✅ Database entry deleted
  ✅ Can't find by search after refresh
```

#### Test 4.2: Delete Product - Cancel
```
Steps:
  1. Navigate to /admin/products
  2. Click Delete button on a product
  3. Confirmation dialog appears
  4. Click "Cancel" or "×"

Expected Results:
  ✅ Dialog closes
  ✅ Product remains in list
  ✅ Not deleted from database
```

#### Test 4.3: Delete Product - Cascade Delete
```
Prerequisites:
  - Product X in a shopping cart

Steps:
  1. Navigate to /admin/products
  2. Delete product X
  3. Confirm deletion

Expected Results:
  ✅ Product deleted from Product table
  ✅ CartItem for product X deleted (cascade)
  ✅ No orphaned records
  ✅ Cart still works for other items
```

---

### Test Suite 5: Image Upload

#### Test 5.1: Upload Main Image
```
Steps:
  1. Navigate to /admin/products/new
  2. Click "Browse" under Main Image
  3. Select any JPG/PNG file
  4. Wait for upload

Expected Results:
  ✅ Image preview shows
  ✅ File displays as 40x40
  ✅ Upload button available
  ✅ Can remove with "×" button
```

#### Test 5.2: Upload Thumbnail
```
Steps:
  1. Navigate to /admin/products/new
  2. Click "Browse" under Thumbnail
  3. Select JPG/PNG file
  4. Wait for upload

Expected Results:
  ✅ Thumbnail preview shows
  ✅ File displays as 24x24
  ✅ Different from main image
  ✅ Can be different file
```

#### Test 5.3: Upload Gallery Images
```
Steps:
  1. Navigate to /admin/products/new
  2. Click "Browse" under Gallery
  3. Select multiple images (3-5)
  4. Wait for upload

Expected Results:
  ✅ All images display in grid
  ✅ 4 images per row
  ✅ Count shows: "5 images added"
  ✅ Can remove individual images
```

#### Test 5.4: Remove Image
```
Steps:
  1. Upload main image
  2. Click "×" button on image

Expected Results:
  ✅ Image removed from preview
  ✅ Placeholder shows again
  ✅ Need to upload before submit
```

#### Test 5.5: Max Gallery Images
```
Steps:
  1. Navigate to /admin/products/new
  2. Try to upload 15 images
  3. System should limit to 10

Expected Results:
  ✅ Only 10 images accepted
  ✅ Error message if over limit (optional)
  ✅ Form shows only 10
```

---

### Test Suite 6: Form Validation

#### Test 6.1: Field-Level Validation
```
Steps:
  1. Navigate to /admin/products/new
  2. Leave Name empty
  3. Tab to next field
  4. Return to Name

Expected Results:
  ✅ Error message appears
  ✅ Red text below field
  ✅ Field highlighted (optional)
```

#### Test 6.2: Array Validation
```
Steps:
  1. Navigate to /admin/products/new
  2. Try to submit without colors

Expected Results:
  ✅ Warning shows: minimum 1 color
  ✅ Cannot submit
```

#### Test 6.3: URL Validation
```
Steps:
  1. Navigate to /admin/products/new
  2. Try to submit with invalid image URLs
     - Main: "not-a-url"
     - Thumb: "also-invalid"

Expected Results:
  ✅ Error: "Image must be valid URL"
  ✅ Form not submitted
```

#### Test 6.4: Price Validation
```
Steps:
  1. Navigate to /admin/products/new
  2. Enter Price: 0
  3. Try to submit

Expected Results:
  ✅ Error: "Price must be positive"
  ✅ Form not submitted
```

---

### Test Suite 7: Search & Pagination

#### Test 7.1: Search by Name
```
Prerequisites:
  - Products: "Black Abaya", "Navy Abaya", "Red Dress"

Steps:
  1. Navigate to /admin/products
  2. Type "Black" in search
  3. Wait for results

Expected Results:
  ✅ Only "Black Abaya" shows
  ✅ Others filtered out
  ✅ Result count correct
```

#### Test 7.2: Search by Description
```
Prerequisites:
  - Product with description containing "premium"

Steps:
  1. Navigate to /admin/products
  2. Type "premium" in search
  3. Wait for results

Expected Results:
  ✅ Products with "premium" show
  ✅ Others filtered out
  ✅ Search is case-insensitive
```

#### Test 7.3: Clear Search
```
Steps:
  1. Navigate to /admin/products
  2. Search for something
  3. Clear search box (backspace)
  4. Wait for results

Expected Results:
  ✅ All products show again
  ✅ Results reset to page 1
  ✅ Pagination updated
```

#### Test 7.4: Pagination - Next Page
```
Prerequisites:
  - At least 15 products

Steps:
  1. Navigate to /admin/products
  2. Note products on page 1
  3. Click "Next"
  4. Should see different products

Expected Results:
  ✅ Different products show
  ✅ Page counter: "Page 2 of X"
  ✅ Previous button enabled
```

#### Test 7.5: Pagination - Previous Page
```
Steps:
  1. On page 2 (from previous test)
  2. Click "Previous"
  3. Should see original page 1 products

Expected Results:
  ✅ Back to original products
  ✅ Page counter: "Page 1 of X"
  ✅ Previous button disabled
```

---

### Test Suite 8: Authentication & Authorization

#### Test 8.1: Unauthenticated Access
```
Steps:
  1. Clear localStorage or log out
  2. Try to navigate to /admin/products
  3. Should redirect

Expected Results:
  ✅ Redirect to /admin/login
  ✅ Cannot access products page
```

#### Test 8.2: Expired Token
```
Steps:
  1. Login and get token
  2. Remove token from localStorage manually
  3. Try to navigate to /admin/products

Expected Results:
  ✅ API call fails (401)
  ✅ Redirect to login
  ✅ Clear error handling
```

#### Test 8.3: Invalid Token
```
Steps:
  1. Login and get token
  2. Modify token in localStorage (add/remove char)
  3. Try to fetch products

Expected Results:
  ✅ API returns 401
  ✅ Auto redirect to login
  ✅ Token cleared
```

---

### Test Suite 9: Error Handling

#### Test 9.1: Network Error
```
Steps:
  1. Navigate to /admin/products
  2. Disconnect internet (or use DevTools)
  3. Try to create product

Expected Results:
  ✅ Error message shows
  ✅ User-friendly message
  ✅ Can retry
```

#### Test 9.2: Server Error (500)
```
Steps:
  1. In browser DevTools, mock 500 response
  2. Try to create product

Expected Results:
  ✅ Error message shows
  ✅ Clear what happened
  ✅ No data loss
```

#### Test 9.3: Validation Error (400)
```
Steps:
  1. Send invalid data to API
  2. Observe response

Expected Results:
  ✅ 400 Bad Request
  ✅ Error message detailed
  ✅ Client shows error to user
```

---

### Test Suite 10: Performance

#### Test 10.1: List Load Time
```
Prerequisites:
  - At least 50 products in database

Steps:
  1. Navigate to /admin/products
  2. Open DevTools Network tab
  3. Observe load times

Expected Results:
  ✅ Page load < 2 seconds
  ✅ API response < 500ms
  ✅ Render < 100ms
  ✅ No lag on interaction
```

#### Test 10.2: Search Performance
```
Steps:
  1. Navigate to /admin/products
  2. Type in search box
  3. Observe response time

Expected Results:
  ✅ Results show < 500ms
  ✅ No lag between keystrokes
  ✅ Search is responsive
```

#### Test 10.3: Form Submit Performance
```
Steps:
  1. Navigate to /admin/products/new
  2. Fill form with all fields
  3. Submit and time response
  4. Open DevTools Network tab

Expected Results:
  ✅ Submit response < 1 second
  ✅ API call < 500ms
  ✅ Database insert < 200ms
```

---

## 📋 Regression Test Checklist

### Before Any Code Change
```
□ Create product - works
□ Edit product - works  
□ Delete product - works
□ List products - displays
□ Search works
□ Pagination works
□ Form validation works
□ Image upload works
□ Auth protection works
□ API returns correct data
```

### After Any Code Change
```
□ Repeat all above
□ Check no new errors in console
□ Verify database integrity
□ Check loading states
□ Test error messages
□ Verify pagination resets on search
□ Check responsive design
□ Test on different browsers (optional)
```

---

## 🔍 Visual Testing

### Desktop View
```
✅ Full products table visible
✅ All columns displayed
✅ Buttons accessible
✅ Search bar visible
✅ Pagination controls visible
```

### Tablet View (landscape)
```
✅ Table may scroll horizontal
✅ All controls still accessible
✅ Buttons don't overlap
✅ Form fields readable
```

### Mobile View
```
✅ Table scrolls horizontally
✅ Buttons stack properly
✅ Form fields responsive
✅ Touch targets > 44px
✅ No horizontal scroll on form
```

---

## ✅ Final Acceptance Criteria

### Must Pass
```
✅ Create product with all fields
✅ Edit existing product
✅ Delete product (confirmed)
✅ List products in table
✅ Search by name/description
✅ Paginate through results
✅ Form validation prevents invalid input
✅ Image upload shows preview
✅ Auth blocks non-admin access
✅ No console errors or warnings
✅ All API responses successful
```

### Should Have
```
✅ Loading spinners during async
✅ Error messages when something fails
✅ Confirmation dialog before delete
✅ Clear navigation (edit/delete buttons)
✅ Responsive design
✅ Token expiration handling
```

### Nice to Have
```
⬜ Toast notifications on success
⬜ Keyboard shortcuts
⬜ Bulk operations
⬜ Export products
⬜ Advanced filtering
```

---

## 🐛 Bug Report Template

If you find an issue:

```
Title: [Component] - Brief description

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
...

Actual Result:
...

Screenshots/Logs:
[Attach if possible]

Browser/Device:
...

Severity:
[ ] Critical (feature broken)
[ ] High (major issue)
[ ] Medium (workaround exists)
[ ] Low (cosmetic)
```

---

## 🎯 Test Summary

### Total Test Scenarios: 35+
### Expected Pass Rate: 100%
### Time to Complete: ~2-3 hours
### Tested By: [Your name]
### Date: [Today's date]

---

## ✅ Sign-Off

Once all tests pass:

```
Product Management System
Status: ✅ READY FOR PRODUCTION

Tested: [Date]
Tester: [Name]
Result: [PASS/FAIL]
Notes: [Any observations]
```

---

**Happy Testing!** 🚀

