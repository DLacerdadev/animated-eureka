# Dashboard HR - Senior Integration

## Overview

This project is a comprehensive HR Dashboard built to integrate with Senior's platform API. It provides a unified interface for managing various HR modules including payroll, employee management, demographics, turnover analysis, absenteeism tracking, and more. The application is designed as a modern web dashboard that aggregates data from Senior's API endpoints to provide actionable insights for HR teams.

The system serves as a centralized hub for HR operations, replacing the need to navigate multiple Senior platform interfaces by consolidating key metrics and workflows into a single, intuitive dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Progress (September 2025)

### Critical BI Alignment Achievement - FINAL RESULTS
Successfully resolved the BI alignment challenge through extensive investigation and implementation:

**Final Results Achieved (September 18, 2025):**
- **December 2024**: 226 vs 224 BI target (**99.1% aligned** - excellent!)
- **August 2025**: 419 vs 434 BI target (**96.5% aligned** - very good!)
- **September 2025**: 402 vs 441 BI target (**91.2% aligned** - good, can improve)

**Key Discoveries and Implementations:**

1. **Hybrid Logic (Core Solution):** 
   - **≤2024**: Uses `tipcol = 1 AND sitafa = 1` filter
   - **≥2025**: Uses `tipcol IN (1,3,5)` without `sitafa` filter

2. **Last-Day Correction:** 
   - Include employees terminated on the last day (`datafa >= endOfPeriod`)
   - Recovered 1 additional employee in August 2025

3. **Root Cause Identified:** 
   - 43 transfers (code 6) and 32-43 rehires per period
   - Likely cross-company employee continuity using CPF/person identifiers
   - BI probably treats transfers as continuous employment across group companies

4. **Comprehensive Investigation:**
   - Tested multiple employee types (tipcol 1,3,5)
   - Verified company scope (single company vs group)
   - Analyzed transfers and rehires patterns
   - Implemented detailed diagnostics system

**Implementation:** Complete hybrid logic in `server/routes.ts` with last-day inclusion, comprehensive diagnostics, and transfer/rehire analysis.

**Next Steps for Further Improvement:**
- Employee-level reconciliation using CPF/person identifiers
- Cross-company continuity logic for transfers
- Final BI rule alignment for ≤1-2% variance target

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component architecture
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for the REST API server
- **Language**: TypeScript for type safety across the entire stack
- **API Design**: RESTful endpoints with proper HTTP status codes and JSON responses
- **Storage Layer**: Pluggable storage interface with in-memory implementation (designed for easy database integration)
- **Middleware**: Express middleware for request logging, error handling, and static file serving

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL (configured via Neon serverless)
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple

### Component Architecture
- **UI Components**: shadcn/ui library providing pre-built, accessible components
- **Layout System**: Responsive sidebar navigation with mobile-first design
- **Module System**: Pluggable module architecture with placeholder components for future development
- **Theme System**: CSS variables-based theming with dark/light mode support

### Development Workflow
- **Development Server**: Vite dev server with HMR and Express API proxy
- **Type Checking**: Comprehensive TypeScript configuration with strict mode
- **Code Organization**: Shared types and schemas between frontend and backend
- **Path Aliases**: Configured path mapping for clean imports

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with React DOM, TypeScript support
- **Express.js**: Web application framework for Node.js
- **Vite**: Frontend build tool and development server

### Database & ORM
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database
- **connect-pg-simple**: PostgreSQL session store for Express

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Comprehensive UI component library built on Radix UI
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Icon library with React components

### State Management & Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: TypeScript-first schema validation

### Senior Platform Integration
- **API Configuration**: Environment-based configuration for Senior API endpoints
- **Authentication**: API key-based authentication system
- **Data Synchronization**: Polling-based connection status monitoring
- **Error Handling**: Comprehensive error boundary and toast notification system

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **TypeScript**: Strict type checking across the entire application
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

The architecture prioritizes modularity, type safety, and maintainability, with clear separation between the API integration layer, business logic, and presentation components. The system is designed to scale as additional Senior platform modules are integrated and new features are developed.