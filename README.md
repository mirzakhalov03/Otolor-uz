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
- **Dashboard** - Overview and analytics
- **Authentication** - Secure JWT-based login with role-based access
- **Management** - Doctors, services, appointments, users, and roles (modular and extensible)

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
│   ├── admin/
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

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

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
