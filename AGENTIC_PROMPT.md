# Otolor Frontend - AI Agent Guidelines

Guidelines for AI agents working on this React/TypeScript codebase.

## Project Context

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + SCSS modules
- **State**: React Query for server state, Context for auth
- **UI Library**: Ant Design (admin), custom components (public)
- **i18n**: i18next with Uzbek as default

## Code Style

### TypeScript

```typescript
// Use explicit types for function parameters and returns
const fetchData = async (id: string): Promise<ApiResponse<User>> => {
  // ...
};

// Prefer interfaces for objects, types for unions/primitives
interface UserProps {
  user: User;
  onUpdate: (user: User) => void;
}

type ButtonVariant = 'primary' | 'secondary' | 'danger';

// Use `type` imports when importing only types
import type { User, ApiResponse } from '../api/types';
```

### React Components

```typescript
// Functional components with explicit FC typing only when needed
const UserCard = ({ user, onUpdate }: UserProps) => {
  return (/* ... */);
};

// Use FC only for components needing children prop typing
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

// Prefer named exports, use default for page components
export const Button = () => {};     // Component
export default UserPage;            // Page
```

### Hooks

```typescript
// Custom hooks start with 'use'
const useAuth = () => {
  // Return object for multiple values
  return { user, isLoading, isAuthenticated };
};

// Use useCallback for event handlers passed as props
const handleSubmit = useCallback((data: FormData) => {
  // ...
}, [dependency]);

// Use useMemo for expensive computations
const filteredList = useMemo(() => 
  items.filter(item => item.active),
  [items]
);
```

## File Structure

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with 'use' prefix | `useAuth.ts` |
| Services | camelCase with '.service' suffix | `auth.service.ts` |
| Queries | camelCase with '.query' suffix | `auth.query.ts` |
| Types | camelCase with '.types' suffix | `user.types.ts` |
| Styles | Same name as component | `UserCard.scss` |
| Constants | camelCase | `index.ts` in constants/ |

### Folder Organization

```
ComponentName/
├── ComponentName.tsx     # Component logic
├── ComponentName.scss    # Styles (if needed)
├── ComponentName.types.ts # Types (if complex)
└── index.ts              # Barrel export
```

## API Layer

### Services (api/services/)

Pure API calls - no React hooks or state:

```typescript
export const userService = {
  async getById(id: string) {
    return baseService.get<User>(`/users/${id}`);
  },
  
  async create(data: CreateUserRequest) {
    return baseService.post<User, CreateUserRequest>('/users', data);
  },
};
```

### Queries (api/query/)

React Query hooks wrapping services:

```typescript
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
```

### Query Keys

```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};
```

## Styling Guidelines

### SCSS Modules

```scss
// Import variables
@import '../../styles/variables';

// BEM naming
.user-card {
  &__header { }
  &__body { }
  &--active { }
}
```

### Tailwind + SCSS

- Use Tailwind for layout and spacing
- Use SCSS for component-specific styles
- Use CSS variables from `_variables.scss` for colors

```tsx
// Combine Tailwind utilities with SCSS classes
<div className="flex items-center gap-4 user-card">
```

## Common Patterns

### Protected Routes

```tsx
// Use guards from components/guards
<AdminRoute>
  <AdminDashboard />
</AdminRoute>

<GuestRoute>
  <LoginPage />
</GuestRoute>
```

### Error Handling

```typescript
// In mutations
onError: (error: ApiResponse) => {
  message.error(error.message || t('errors.generic'));
}

// In components
if (error) {
  return <Alert type="error" message={error.message} />;
}
```

### Translations

```tsx
const { t } = useTranslation();

// Simple
<span>{t('nav.home')}</span>

// With interpolation
<span>{t('welcome', { name: user.name })}</span>
```

## Do's and Don'ts

### Do

- Use existing components from `components/`
- Add types to `api/types/index.ts`
- Use React Query for all API calls
- Use constants from `constants/index.ts`
- Add translations for user-facing text
- Write JSDoc comments for exported functions

### Don't

- Create redundant components (check existing first)
- Use `any` type (use `unknown` if truly unknown)
- Mutate state directly
- Use inline styles (prefer Tailwind/SCSS)
- Hardcode strings (use translations)
- Skip error handling

## Quick Reference

### Adding a New Feature

1. **Types**: Add to `api/types/index.ts`
2. **Service**: Create in `api/services/`
3. **Query hooks**: Create in `api/query/`
4. **Components**: Create in `components/` or page-specific folder
5. **Route**: Add to `router/routes.tsx`
6. **Translations**: Add to all locale files

### Adding a New Page

```
pages/
└── newPage/
    ├── NewPage.tsx
    ├── newPage.scss
    ├── components/     # Page-specific components
    └── index.ts
```

Then add route in `router/routes.tsx`.

### Adding a New Admin Page

Follow the scalable pattern for consistency:

```
pages/admin/resource/
├── components/
│   ├── ResourceList.tsx      # Main list with DataTable
│   ├── CreateResource.tsx    # Create form
│   └── EditResource.tsx      # Edit form
├── config/
│   └── resource.config.tsx   # Table columns & constants
└── index.ts                  # Exports
```

**Steps:**

1. **Create config file:**
```tsx
// config/resource.config.tsx
export const getResourceColumns = (actions) => [
  // Define table columns with render functions
];

export const RESOURCE_PAGE_CONFIG = {
  title: 'Resource Management',
  description: 'Manage resources',
  searchPlaceholder: 'Search...',
  createButtonText: 'Add Resource',
  defaultPageSize: 10,
};
```

2. **Create List component:**
```tsx
// components/ResourceList.tsx
import { PageHeader, DataTable } from '../../../../components/admin/shared';
import { getResourceColumns, RESOURCE_PAGE_CONFIG } from '../config/resource.config';

const ResourceList = () => {
  const { data, isLoading } = useResources({ page, limit, search });
  const columns = getResourceColumns({ onView, onEdit, onDelete });
  
  return (
    <>
      <PageHeader {...RESOURCE_PAGE_CONFIG} onSearch={...} />
      <DataTable columns={columns} dataSource={data?.data} ... />
    </>
  );
};
```

3. **Create forms** (Create & Edit)
4. **Export from index.ts**
5. **Add route** in `router/routes.tsx`

## Testing Checklist

Before submitting:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] All user text is translated
- [ ] Responsive on mobile
- [ ] Loading states handled
- [ ] Error states handled
