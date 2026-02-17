# Otolor - Medical Clinic Platform

Modern, multilingual medical clinic website built with React, TypeScript, and Vite.

## Features

### Public Site
- **Home Page** - Hero section, features showcase, services overview, team presentation
- **Services** - Clinic services with detailed descriptions
- **Academy** - Educational content and resources
- **About** - Clinic information and team details
- **Appointments** - Doctor selection and appointment booking system

### Admin Panel
- **Dashboard** - Overview and analytics with real-time statistics
- **Authentication** - Secure JWT-based login with role-based access control
- **Doctors Management** - Full CRUD operations for doctor profiles with search and pagination
- **Services Management** - Manage clinic services with multilingual support
- **Appointments** - View and manage patient appointments (coming soon)
- **Users & Roles** - User management and permission system (coming soon)

### Core Capabilities
- **Multi-language Support** - Uzbek (default), Russian, and English with i18next
- **Responsive Design** - Mobile-first with Tailwind CSS + SCSS
- **Role-Based Access Control** - Admin, SuperAdmin, Doctor, User roles with permissions
- **API Integration** - React Query for data fetching with automatic caching

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 + SCSS |
| State Management | React Query (TanStack Query) |
| UI Components | Ant Design 6 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| i18n | i18next |
| Icons | Lucide React, React Icons |

## Project Structure

```
src/
├── api/                    # API layer
│   ├── axiosInstance.ts    # Axios config with interceptors
│   ├── baseService.ts      # HTTP method wrappers
│   ├── services/           # API service modules
│   ├── query/              # React Query hooks
│   └── types/              # TypeScript interfaces
├── assets/                 # Static assets (images, icons, fonts)
├── components/             # Reusable components
│   ├── admin/              # Admin panel components
│   │   ├── DataTable/      # Reusable table with pagination
│   │   ├── header/         # Admin header with actions
│   │   ├── layout/         # Admin layout wrapper
│   │   ├── shared/         # Shared admin components
│   │   │   └── PageHeader/ # Page header with search/filters
│   │   └── sidebar/        # Navigation sidebar
│   ├── buttons/            # Button components
│   ├── carousel/           # Image carousel
│   ├── CTA-buttons/        # Call-to-action buttons
│   ├── footer/             # Footer component
│   ├── guards/             # Route protection (Auth, Guest)
│   ├── langSelector/       # Public language selector
│   ├── languageSelector/   # Admin language selector
│   ├── layout/             # Layout wrapper
│   ├── navbar/             # Navigation bar
│   └── spinner/            # Loading spinner
├── constants/              # App-wide constants
├── context/                # React Context providers
│   └── AuthContext.tsx     # Authentication state
├── languages/              # i18n configuration
├── pages/                  # Page components
│   ├── about/
│   ├── academy/
│   ├── admin/              # Admin pages
│   │   ├── dashboard/      # Dashboard page
│   │   ├── doctors/        # Doctors management
│   │   │   ├── components/ # DoctorsList, Create, Edit
│   │   │   └── config/     # Table columns config
│   │   ├── login/          # Admin login
│   │   └── services/       # Services management
│   │       ├── components/ # ServicesList, Create, Edit
│   │       └── config/     # Table columns config
│   ├── appointments/
│   ├── home/
│   ├── servicesPage/
│   └── unauthorized/
├── router/                 # Route definitions
└── styles/                 # Global styles and variables
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Environment Variables

Creatdmin Page Structure
Each admin page follows a consistent, scalable pattern:

```
pages/admin/{resource}/
├── components/
│   ├── {Resource}List.tsx      # Main list view with table
│   ├── Create{Resource}.tsx    # Create form
│   └── Edit{Resource}.tsx      # Edit form
├── config/
│   └── {resource}.config.tsx   # Table columns & settings
└── index.ts                    # Exports for routing
```

**Benefits:**
- **Separation of Concerns** - Config, UI, and logic are isolated
- **Reusability** - Shared components (DataTable, PageHeader)
- **Maintainability** - Easy to modify table structure in config
- **Scalability** - Simple to add new admin pages following the pattern

### Ae a `.env` file:

```env
- Admin services support multilingual content (uz, ru, en)
Development Guidelines

### Adding a New Admin Page

1. **Create folder structure:**
   ```
   pages/admin/{resource}/
   ├── components/
   ├── config/
   └── index.ts
   ```

2. **Create config file** (`config/{resource}.config.tsx`):
   - Define table columns
   - Set page constants (title, search placeholder, etc.)

3. **Create List component** (`components/{Resource}List.tsx`):
   - Use PageHeader and DataTable
   - Implement search, refresh, create handlers
   - Pass config to columns generator

4. **Create forms** (Create & Edit components):
   - Use Ant Design Form components
   - Implement validation
   - Handle API mutations

5. **Export from index.ts** and add route in `router/routes.tsx`

See [AGENTIC_PROMPT.md](./AGENTIC_PROMPT.md) for detailed coding guidelines.

## 
Follow the development guidelines above and see [AGENTIC_PROMPT.md](./AGENTIC_PROMPT.md) for coding standards.

## Project Status

**Completed:**
- ✅ Admin authentication & authorization
- ✅ Doctors management (full CRUD)
- ✅ Services management (full CRUD)
- ✅ Reusable admin components (DataTable, PageHeader)
- ✅ Multilingual support (uz, ru, en)
- ✅ Responsive design

**Coming Soon:**
- 🚧 Appointments management
- 🚧 Users & roles management
- 🚧 Analytics dashboard
- 🚧 File uploads for services

### Doctors Management
- **List View** - Searchable, paginated table with filtering
- **Create** - Add new doctors with profile information
- **Edit** - Update doctor details, availability, and fees
- **Delete** - Soft delete with confirmation
- **Columns**: Doctor info, specialization, experience, fee, rating, languages, status

### Services Management
- **List View** - Multilingual service display with search
- **Create** - Add services with translations in uz/ru/en
- **Edit** - Update service details and pricing
- **Delete** - Remove services with confirmation
- **Columns**: Image, name (all languages), category, price, duration, status

### Shared Components
- **DataTable** - Reusable table with pagination, search, and actions
- **PageHeader** - Consistent header with search, filters, and action buttons
- **AdminLayout** - Sidebar navigation and header wrapper

## Development Guideline

## Architecture Patterns

### API Layer
- **Services**: Pure API calls mapped to backend endpoints
- **Queries**: React Query hooks for data fetching/mutations
- **Types**: Shared TypeScript interfaces matching backend contracts

### Authentication Flow
1. JWT access token stored in localStorage
2. Refresh token as HTTP-only cookie
3. Automatic token refresh on 401 responses
4. Role-based route guards (AdminRoute, GuestRoute)

### Internationalization
- Default language: Uzbek
- Translation files in `public/locales/{lang}/translation.json`
- Automatic language detection via browser/localStorage

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Contributing

See [AGENTIC_PROMPT.md](./AGENTIC_PROMPT.md) for coding guidelines.

## License

Private - All rights reserved.
