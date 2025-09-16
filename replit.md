# Dashboard HR - Senior Integration

## Overview

This project is a comprehensive HR Dashboard built to integrate with Senior's platform API. It provides a unified interface for managing various HR modules including payroll, employee management, demographics, turnover analysis, absenteeism tracking, and more. The application is designed as a modern web dashboard that aggregates data from Senior's API endpoints to provide actionable insights for HR teams.

The system serves as a centralized hub for HR operations, replacing the need to navigate multiple Senior platform interfaces by consolidating key metrics and workflows into a single, intuitive dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

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