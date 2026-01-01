# AbayasStorefront - Refactoring Guide: server/client → backend/frontend

## 🎯 Objective
Rename folder structure from `server/client` to `backend/frontend` for industry-standard naming conventions.

## 📋 Migration Checklist

### Phase 1: Documentation & Planning ✅
- [x] Identify all files that reference server/client
- [x] Create migration plan
- [x] Document all import paths

### Phase 2: Directory Rename (Optional - Manual Step)
Execute these commands:
```bash
# In the project root
mv server backend
mv client frontend
```

### Phase 3: Update Configuration Files

#### Root package.json
Update scripts and paths:
```json
{
  "scripts": {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build:backend": "vite build --config vite.config.backend.ts",
    "build:frontend": "cd frontend && npm run build"
  }
}
```

#### vite.config.server.ts → vite.config.backend.ts
```typescript
entry: path.resolve(__dirname, "backend/src/node-build.ts"),
alias: {
  "@": path.resolve(__dirname, "./frontend/src"),
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["frontend/src/*"],
      "@shared/*": ["shared/*"]
    }
  }
}
```

### Phase 4: Update Import Paths

#### All frontend files using @shared
No change needed (alias still works)

#### All backend files using @shared
No change needed (alias still works)

### Phase 5: Verify Builds

```bash
# Test each build
npm run build:frontend
npm run build:backend

# Verify output paths
ls -la frontend/dist/
ls -la dist/backend/
```

---

## 📁 Files That Need Updates (If Renaming)

### Configuration Files
- [ ] `vite.config.server.ts` → rename to `vite.config.backend.ts`
- [ ] `package.json` - update all script paths
- [ ] `./frontend/vite.config.ts` - keep current
- [ ] `./backend/vite.config.ts` - if it exists
- [ ] `.github/workflows/ci.yml` - update paths
- [ ] `.github/workflows/cd.yml` - if it exists

### Shared Types/Interfaces
- [ ] `shared/api.ts` - no change needed
- [ ] `shared/plugins.ts` - no change needed

### Documentation
- [ ] Update all README files
- [ ] Update API documentation
- [ ] Update deployment guides

---

## 🚨 Important Notes

### Why server/client → backend/frontend?
1. **Industry Standard**: Modern projects use these terms
2. **Clarity**: Less ambiguous than "server" (could be gameserver, etc.)
3. **Consistency**: Matches SaaS/Web standards

### Breaking Changes
- Import paths change from `../server/` to `../backend/`
- Path aliases remain the same (`@` and `@shared`)
- Script commands change names

### Backwards Compatibility
- Old code will still work if you keep `server/client` names
- Recommendation: Do full migration in one go to avoid confusion

---

## 📊 File Categories by Impact

### HIGH IMPACT (Direct references)
- [ ] Root `package.json` scripts
- [ ] `.github/workflows/*.yml` paths
- [ ] `vite.config.server.ts` → `vite.config.backend.ts`
- [ ] `tsconfig.json` paths

### MEDIUM IMPACT (Relative imports)
- [ ] Any `../server/src/` imports (change to `../backend/src/`)
- [ ] Any `../client/src/` imports (change to `../frontend/src/`)

### LOW IMPACT (Alias imports)
- [ ] `@/` imports (no change - still works)
- [ ] `@shared/` imports (no change - still works)

---

## 🔄 Migration Execution Order

1. **Create backend folder** → Copy all server/ contents
2. **Create frontend folder** → Copy all client/ contents
3. **Update root configs** → package.json, vite configs, tsconfig
4. **Update CI/CD** → .github/workflows/
5. **Test builds** → Verify everything compiles
6. **Delete old folders** → server/ and client/ (after verification)
7. **Update docs** → All markdown files

---

## ✅ Verification Checklist

After migration:
```bash
# Build check
npm run build                  # Should succeed
npm run build:frontend         # Should produce frontend/dist/
npm run build:backend          # Should produce dist/backend/

# Typecheck
npm run typecheck             # Should have 0 errors

# Start server
npm start                     # Should serve on port 3000

# Test API endpoints
curl http://localhost:3000/api/ping
# Should return: { "message": "ping pong" }

# Check frontend
# http://localhost:3000 should show the website
```

---

## 🎯 Recommended Implementation

### Option A: Keep Current (QUICK)
- ✅ Don't rename directories
- ✅ Keep scripts and imports as-is
- ✅ Update imports gradually
- **Time**: 1-2 hours

### Option B: Full Migration (RECOMMENDED)
- ✅ Rename server/ → backend/
- ✅ Rename client/ → frontend/
- ✅ Update all imports
- ✅ Update all configs
- **Time**: 3-4 hours

### Option C: Gradual Migration (SAFEST)
- ✅ Create backend/ and frontend/ copies
- ✅ Update imports in backend/frontend
- ✅ Keep server/client as fallback
- ✅ Remove server/client after verification
- **Time**: 4-5 hours

---

**Recommendation**: Proceed with **Option B (Full Migration)** since the project is still in development phase and the change will bring better long-term code clarity.

Would you like to proceed with the migration? If yes:

1. Run the directory rename commands above
2. Follow through Phases 3-5
3. Run full test suite
4. Verify with `npm run build` and `npm start`
