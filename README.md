# Archject — Client Approval & Choice Links for Service Businesses

Archject streamlines client approvals for service businesses—architects, designers, agencies, and freelancers—by replacing clunky email threads with branded, auditable choice links.

## Tech Stack

- **React 18** with TypeScript
- **Vite** with SWC
- **Tailwind CSS v3** with custom design system
- **React Router 6**
- **TanStack React Query**
- **React Hook Form** + **Zod**
- **Shadcn/ui** (Radix UI primitives)
- **Recharts** for data visualization
- **Sonner** for toasts
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run build
```

## Project Structure

- `src/pages/` — Page components
- `src/components/` — Reusable UI components
- `src/components/ui/` — Shadcn-style primitives
- `src/components/layout/` — Layout components (sidebar, header)
- `src/lib/` — Utilities (api, utils)
- `src/routes.tsx` — React Router configuration

## Key Pages

- **Landing** — Marketing site with hero, features, how it works
- **Auth** — Login, signup, forgot password, email verification
- **Dashboard** — Overview, projects, approvals, exports, settings
- **Create Approval** — Multi-step wizard
- **Client Review** — Public branded approval interface
- **Admin** — User management, analytics
- **Legal** — Privacy, terms, cookies

## Design System

Archject uses a custom design system with CSS variables for theming. Primary brand color: `#6A5BFF`.
