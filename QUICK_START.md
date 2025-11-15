# Quick Reference Guide

## Start Development Immediately

```bash
# 1. Install/start dev server
pnpm dev

# 2. In another terminal, seed the database
pnpm exec tsx seed.ts

# 3. Open http://localhost:8080
```

That's it! Your app is ready with:
- 4 products in database
- Shopping cart with API persistence
- All endpoints functional

---

## Key API Endpoints

### Get Products
```bash
curl http://localhost:8080/api/products
```

### Add to Cart
```bash
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "guest_xxx",
    "productId": "cmhz52vhg0000...",
    "quantity": 1,
    "size": "M"
  }'
```

### Get Cart
```bash
curl "http://localhost:8080/api/cart?customerId=guest_xxx"
```

---

## Useful Files

| File | Purpose |
|------|---------|
| `DATABASE_INTEGRATION.md` | Complete API documentation |
| `INTEGRATION_COMPLETE.md` | Feature summary |
| `prisma/schema.prisma` | Database schema |
| `client/lib/api.ts` | API client methods |
| `client/hooks/useCart.tsx` | Cart management |
| `seed.ts` | Database seeding |

---

## Available Products (Pre-seeded)

1. **Sable Classic Abaya** - 475 AED
2. **Noor Sand Kimono Abaya** - 585 AED
3. **Almond Embroidered Edge** - 695 AED
4. **Eid Gold Trim Abaya** - 805 AED

---

## Database Reset

```bash
# Delete database
rm dev.db

# Recreate & seed
pnpm exec tsx seed.ts
```

---

## What Works Now

✅ Product listing (from database)
✅ Product details
✅ Add to cart (persists)
✅ Update cart quantities
✅ Remove from cart
✅ Clear cart
✅ Guest & customer carts
✅ Type-safe API calls

---

## Integration Features

### Optimistic Updates
- UI updates immediately
- Syncs with server
- Reverts on error

### Offline Fallback
- LocalStorage backup
- Works without internet
- Syncs when online

### Type Safety
- TypeScript throughout
- Shared `@shared/api.ts` types
- Zero any's in core code

### Error Handling
- Proper HTTP status codes
- User-friendly error messages
- API error responses

---

## Environment Variables

Already configured in `.env`:
```
DATABASE_URL="file:./dev.db"
VITE_PUBLIC_BUILDER_KEY=...
PING_MESSAGE="ping pong"
```

No additional setup needed!

---

## Need Help?

1. Check `DATABASE_INTEGRATION.md` for detailed docs
2. Look at `client/lib/api.ts` for available methods
3. Review `server/routes/` for endpoint implementations
4. Check browser console for error messages

---

## Production Checklist

- [ ] Switch to PostgreSQL in `prisma/schema.prisma`
- [ ] Update `DATABASE_URL` in production `.env`
- [ ] Run `prisma migrate deploy` on production
- [ ] Add authentication layer
- [ ] Set up payment processing
- [ ] Configure CORS for production domain
- [ ] Add rate limiting
- [ ] Set up error logging
- [ ] Enable HTTPS

---

**Your app is ready to use! Start with `pnpm dev` 🚀**
