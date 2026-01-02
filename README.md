# 🛍️ Abayas Store - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built specifically for selling abayas and modest fashion. Built with React, TypeScript, Express, and Prisma with a powerful admin CMS.

## 🌟 Features

### Customer Features
- 🛒 **Shopping Cart** - Add to cart, update quantities, manage items
- 🔍 **Product Browsing** - Browse products with filtering and search
- 👤 **Customer Authentication** - Register, login, profile management
- 📦 **Order Management** - Place orders, view order history
- 💳 **Multiple Payment Methods** - Cash on Delivery (COD) and Card payments
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🌙 **Dark Mode** - Theme switching support

### Admin Features
- 📊 **Dashboard** - Sales analytics, order statistics, revenue tracking
- 📦 **Product Management** - CRUD operations for products and variants
- 🏷️ **Inventory Management** - Stock tracking, sizes, colors
- 📷 **Image Upload** - Local image storage with optimization
- 🛍️ **Order Management** - View, process, and update orders
- 👥 **Customer Management** - View customer data and order history
- ⚙️ **Settings Management** - Configure store settings
- 🎨 **Homepage CMS** - Manage homepage content sections
- 🔐 **Role-Based Access** - Admin, manager, and editor roles
- 📝 **Audit Logging** - Track all admin actions

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- React Router v6 for navigation
- TailwindCSS for styling
- Radix UI components
- React Query for data fetching
- Zod for validation
- React Hook Form for forms
- Vite for build tooling

**Backend:**
- Node.js with Express
- TypeScript
- Prisma ORM with SQLite (development)
- JWT authentication
- Bcrypt for password hashing
- Multer for file uploads
- Zod for API validation

**Database:**
- SQLite (development)
- PostgreSQL ready (production)

## 📁 Project Structure

```
AbayasStorefont/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── components/      # Reusable components
│   │   ├── customer/        # Customer-facing pages
│   │   ├── lib/            # Utilities and API client
│   │   ├── ui/             # UI component library
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   │   ├── admin/      # Admin endpoints
│   │   │   └── customer/   # Customer endpoints
│   │   ├── prisma/         # Prisma schema and migrations
│   │   ├── types/          # TypeScript type definitions
│   │   ├── middleware.ts   # Auth middleware
│   │   └── index.ts        # Server entry point
│   └── package.json
│
├── shared/                   # Shared types between frontend/backend
│   ├── api.ts              # API type definitions
│   └── plugins.ts          # Plugin system types
│
├── DOCUMENTATION/           # Project documentation
├── APIDog/                 # API testing collections
├── .env                    # Environment variables
└── package.json            # Root package.json (monorepo scripts)
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd AbayasStorefont
```

2. **Install dependencies:**
```bash
# Install root dependencies
pnpm install

# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

3. **Set up environment variables:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
```

4. **Set up the database:**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. **Seed the database (optional):**
```bash
# From root directory
node seed-abayas.ts
node seed-homepage.ts
```

### Running the Application

**Development Mode:**

```bash
# Run both frontend and backend concurrently
pnpm run dev:both

# OR run separately:

# Terminal 1 - Backend (Port 3000)
cd backend
pnpm run dev

# Terminal 2 - Frontend (Port 5173)
cd frontend
pnpm run dev
```

**Production Build:**

```bash
# Build frontend
pnpm run build:frontend

# Build backend
pnpm run build:backend

# Start production server
pnpm start
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api

## 🔑 Default Admin Credentials

After seeding the database, you can login with:

```
Email: admin@example.com
Password: admin123
```

⚠️ **Change these credentials immediately in production!**

## 📡 API Endpoints

### Customer Endpoints

#### Authentication
- `POST /api/customer/register` - Register new customer
- `POST /api/customer/login` - Customer login
- `GET /api/customer/profile` - Get customer profile
- `PUT /api/customer/profile` - Update profile
- `POST /api/customer/change-password` - Change password

#### Products
- `GET /api/products` - List all products (paginated)
- `GET /api/products/:id` - Get product details

#### Cart
- `GET /api/cart` - Get customer cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item
- `POST /api/cart/clear` - Clear cart

#### Orders
- `POST /api/customer/orders/create` - Create order from cart
- `GET /api/customer/orders` - List customer orders
- `GET /api/customer/orders/:id` - Get order details
- `GET /api/customer/orders/number/:orderNumber` - Get order by number

### Admin Endpoints

#### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/auth/profile` - Get admin profile

#### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

#### Products
- `GET /api/admin/products` - List products (paginated, filterable)
- `GET /api/admin/products/:id` - Get product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/bulk/delete` - Bulk delete
- `POST /api/admin/products/bulk/update-price` - Bulk update prices
- `POST /api/admin/products/bulk/update-stock` - Bulk update stock
- `GET /api/admin/products/export` - Export products

#### Orders
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/stats/summary` - Order statistics
- `POST /api/admin/orders` - Create order
- `GET /api/admin/orders/:id` - Get order
- `PUT /api/admin/orders/:id/status` - Update order status

#### Homepage CMS
- `GET /api/admin/homepage` - List homepage sections
- `GET /api/admin/homepage/:id` - Get section
- `POST /api/admin/homepage` - Create section
- `PUT /api/admin/homepage/:id` - Update section
- `DELETE /api/admin/homepage/:id` - Delete section

#### Image Upload
- `POST /api/admin/upload` - Upload image (multipart/form-data)
- `DELETE /api/admin/upload/:filename` - Delete image

## 🗄️ Database Schema

### Main Models

**Customer:**
- Authentication & profile information
- Password hashing with bcrypt
- Addresses and contact details

**Product:**
- Name, description, pricing
- Images (main, thumbnail, gallery)
- Stock management
- Tags and categories

**ProductVariant:**
- Size and color combinations
- Individual pricing and stock

**Order:**
- Order tracking and status
- Subtotal, tax, shipping calculations
- Customer relationship

**OrderItem:**
- Product and variant references
- Quantity and price snapshot

**Cart & CartItem:**
- Session-based shopping cart
- Temporary item storage

**Admin:**
- Role-based access control
- Audit logging

**HomepageContent:**
- Dynamic CMS sections
- Image and text content

## 🔐 Authentication

### Customer Authentication
- JWT-based authentication
- Tokens stored in localStorage
- 7-day expiration (configurable)
- Password hashing with bcrypt (10 rounds)

### Admin Authentication
- Separate JWT tokens
- Role-based access control (admin, manager, editor)
- Audit logging for all actions
- Middleware protection on sensitive routes

## 🎨 Frontend Routes

### Customer Pages
- `/` - Homepage
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - Customer login
- `/register` - Customer registration
- `/profile` - Customer profile
- `/orders` - Order history
- `/order/:orderNumber` - Order confirmation

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Analytics dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Create product
- `/admin/products/:id/edit` - Edit product
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/homepage` - CMS homepage editor
- `/admin/settings` - Store settings

## 🧪 Testing

```bash
# Run tests
pnpm test

# Type checking
pnpm run typecheck

# Frontend type check
cd frontend && npx tsc --noEmit

# Backend type check
cd backend && npx tsc --noEmit
```

## 📦 Deployment

### Environment Variables for Production

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Security
NODE_ENV="production"
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
FRONTEND_URL="https://yourdomain.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Upload
UPLOAD_DIR="./public/uploads"
```

### Netlify Deployment

The project is configured for Netlify deployment:

```bash
# Build command (configured in netlify.toml)
pnpm run build

# The build outputs to:
# - Frontend: frontend/dist
# - Backend: dist/backend
```

### Database Migration

For production, migrate from SQLite to PostgreSQL:

1. Update `DATABASE_URL` in `.env`
2. Run migrations:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

## 🛡️ Security Considerations

⚠️ **Important Security Notes:**

1. **Change default JWT secret** in production
2. **Remove default admin credentials** after first login
3. **Use HTTPS** in production
4. **Set secure CORS policies** in `backend/src/index.ts`
5. **Validate all inputs** (currently using Zod)
6. **Rate limiting** - Consider adding for production
7. **Environment variables** - Never commit `.env` to git

## 🐛 Known Issues & Limitations

- SQLite is used for development (use PostgreSQL for production)
- Image storage is local (consider cloud storage for production)
- No email service integration yet
- Payment integration needs production Stripe keys
- No real-time order updates (consider WebSockets)

## 📝 Scripts Reference

### Root Scripts
```bash
pnpm run dev              # Start frontend dev server
pnpm run dev:both         # Start both frontend & backend
pnpm run dev:frontend     # Start only frontend
pnpm run dev:backend      # Start only backend
pnpm run build            # Build both projects
pnpm run build:frontend   # Build frontend only
pnpm run build:backend    # Build backend only
pnpm run start            # Start production server
pnpm run test             # Run tests
pnpm run typecheck        # TypeScript type checking
```

### Backend Scripts
```bash
cd backend
pnpm run dev              # Start dev server with tsx
pnpm run build            # Compile TypeScript
pnpm start                # Start production server
```

### Frontend Scripts
```bash
cd frontend
pnpm run dev              # Start Vite dev server
pnpm run build            # Build for production
pnpm run preview          # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Support

For support, contact your development team or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Radix UI for accessible components
- Prisma for the excellent ORM
- All open-source contributors

---

**Built with ❤️ for modest fashion retail**
