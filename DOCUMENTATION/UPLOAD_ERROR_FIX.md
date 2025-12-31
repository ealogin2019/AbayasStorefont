# Image Upload Error Fix - November 15, 2025

## Issue Found

**Error:** `POST http://localhost:8080/api/admin/upload 400 (Bad Request)`  
**Root Cause:** The `type` parameter wasn't being passed correctly to the server

## Root Cause Analysis

The issue was in how FormData fields were being sent:

**Before (Broken):**
```javascript
const formData = new FormData();
formData.append("file", file);
formData.append("type", type);  // ❌ Text fields in FormData not parsed by Express

await fetch("/api/admin/upload", {
  method: "POST",
  headers: { Authorization: "Bearer {token}" },
  body: formData,
});
```

When using `multipart/form-data`, Express's `express.json()` middleware doesn't parse text fields from the FormData body. The `type` field was undefined on the server side.

## Solution Implemented

**After (Fixed):**
```javascript
const formData = new FormData();
formData.append("file", file);

const uploadType = type === "main" ? "product" : type;

// ✅ Send type as query parameter instead
await fetch(`/api/admin/upload?type=${uploadType}`, {
  method: "POST",
  headers: { Authorization: "Bearer {token}" },
  body: formData,
});
```

**Server-side:**
```typescript
// ✅ Read type from query parameter
let fileType = (req.query.type as string) || "product";
```

## Changes Made

### File: `client/components/admin/ImageUploader.tsx`
- Changed: Type parameter now sent as query parameter in URL
- Line 62-69: Updated fetch URL to include `?type=${uploadType}`
- Removed: `formData.append("type", uploadType)`

### File: `server/routes/admin/upload.ts`
- Changed: Read type from `req.query.type` instead of `req.body.type`
- Simplified: Removed array handling (not needed with query params)
- Result: Much cleaner and more reliable implementation

## Testing

To test the fix:

1. **Restart dev server**
   ```bash
   npm run dev
   ```

2. **Upload an image**
   - Go to Admin → Products → Create
   - Click "Browse" for Main Image
   - Select a JPEG/PNG/GIF/WebP file
   - Should upload successfully

3. **Check Network Tab**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Upload an image
   - Should see: `POST /api/admin/upload?type=product 200 OK`

4. **Verify File Created**
   ```bash
   ls -la public/uploads/products/
   ```
   Should see files like: `1731655234567-abc123.jpg`

## Why This Works

**Query Parameters vs FormData Fields:**
- ✅ Query parameters are always parsed by Express automatically
- ❌ FormData text fields require special middleware (like busboy or multer.fields)
- ✅ Query parameters work well for small, simple values like image types

**Benefits of this approach:**
1. Simpler - no need for additional middleware
2. Cleaner - URL clearly shows what type of upload
3. Reliable - Express parses query params by default
4. Maintains - FileList in FormData where it belongs

## Complete Fix Summary

| Aspect | Before | After |
|--------|--------|-------|
| Type parameter | In FormData body | In query string |
| Server reads from | `req.body.type` | `req.query.type` |
| URL example | `/api/admin/upload` | `/api/admin/upload?type=product` |
| Parsing required | Custom middleware | Built-in Express |
| Error handling | Complex | Simple |

## Files Modified

1. ✅ `client/components/admin/ImageUploader.tsx` - Updated fetch call
2. ✅ `server/routes/admin/upload.ts` - Updated parameter reading

## Verification

All TypeScript errors cleared:
- ✅ No compilation errors
- ✅ No type errors
- ✅ No import errors

## Next Steps

1. Restart the development server
2. Test image upload via admin dashboard
3. Verify images appear in `public/uploads/products/`
4. Verify images display on product pages

---

**Status:** ✅ Fixed and Ready for Testing

**Upload flow should now work correctly!**
