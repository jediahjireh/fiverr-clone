# Fiverr Clone - Next.js Full-Stack Application

A modern, full-stack freelance marketplace built with Next.js 15, featuring the
App Router, TypeScript, Prisma ORM, NextAuth and Tailwind CSS.

<!-- Table of Contents -->

- [Fiverr Clone - Next.js Full-Stack Application](#fiverr-clone---nextjs-full-stack-application)
  - [🚀 Features](#-features)
    - [Core Functionality](#core-functionality)
    - [Technical Features](#technical-features)
  - [📋 Prerequisites](#-prerequisites)
  - [🛠️ Installation \& Setup](#️-installation--setup)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Environment Variables](#3-environment-variables)
    - [4. Database Setup](#4-database-setup)
    - [5. Run the Application](#5-run-the-application)
  - [📁 Project Structure](#-project-structure)
  - [🔧 API Documentation](#-api-documentation)
    - [Authentication Endpoints](#authentication-endpoints)
    - [Gig Endpoints](#gig-endpoints)
    - [Order Endpoints](#order-endpoints)
    - [Review Endpoints](#review-endpoints)
    - [Message Endpoints](#message-endpoints)
  - [🎨 UI Components](#-ui-components)
  - [🔐 Authentication Flow](#-authentication-flow)
  - [💳 Payment Integration](#-payment-integration)
  - [📱 Responsive Design](#-responsive-design)
  - [🚀 Deployment](#-deployment)
    - [Vercel (Recommended)](#vercel-recommended)
    - [Manual Deployment](#manual-deployment)
  - [🧪 Development Tools](#-development-tools)
  - [🤝 Contributing](#-contributing)
    - [Development Guidelines](#development-guidelines)
  - [🆘 Support](#-support)
  - [🔄 Changelog](#-changelog)
    - [v1.0.0](#v100)

## 🚀 Features

### Core Functionality

- **User Authentication**: Secure login/register with NextAuth.js
- **Dual User Types**: Buyers and Sellers with different permissions
- **Gig Management**: Create, edit, delete, and browse freelance services
- **Advanced Search & Filtering**: Search by keywords, category, price range
- **Order Management**: Complete order lifecycle with Stripe integration
- **Review System**: Rate and review completed services
- **Real-time Messaging**: Communication between buyers and sellers
- **Payment Processing**: Secure payments via Stripe
- **File Uploads**: Image uploads for gigs and profiles
- **Responsive Design**: Mobile-first, fully responsive UI

### Technical Features

- **Next.js 15 App Router**: Modern React framework with server components
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations with MongoDB
- **NextAuth.js**: Authentication with JWT strategy
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern, accessible UI components
- **React Query**: Server state management and caching
- **Zod**: Runtime type validation
- **Stripe**: Payment processing integration

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- pnpm package manager
- MongoDB database (local or cloud)
- Stripe account for payments
- UploadThing account for file uploads

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jediahjireh/fiverr-clone.git
cd nextjs-fiverr-clone
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env

# Database

DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/fiverr-clone"

# NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Stripe

STRIPE*SECRET_KEY="sk_test*..."
STRIPE*PUBLISHABLE_KEY="pk_test*..."
STRIPE*WEBHOOK_SECRET="whsec*..."

# UploadThing

UPLOADTHING*SECRET="sk_live*..."
UPLOADTHING_APP_ID="your-app-id"

# App Settings

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

```bash

# Generate Prisma client

pnpm db:generate

# Push database schema

pnpm db:push

# (Optional) Seed database with sample data

pnpm db:seed
```

### 5. Run the Application

```bash

# Development mode

pnpm dev

# Production build

pnpm build
pnpm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```zsh
├── app/ # Next.js App Router pages
│ ├── api/ # API routes
│ ├── (auth)/ # Authentication pages
│ ├── gigs/ # Gig-related pages
│ ├── dashboard/ # User dashboard
│ └── globals.css # Global styles
├── components/ # Reusable UI components
│ ├── ui/ # Shadcn/ui components
│ └── ... # Custom components
├── lib/ # Utility functions and configurations
│ ├── auth.ts # NextAuth configuration
│ ├── prisma.ts # Prisma client
│ ├── utils.ts # Utility functions
│ └── validations.ts # Zod schemas
├── prisma/ # Database schema and migrations
│ ├── schema.prisma # Prisma schema
│ └── seed.ts # Database seeding
├── types/ # TypeScript type definitions
└── public/ # Static assets
```

## 🔧 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Gig Endpoints

- `GET /api/gigs` - Get all gigs with filtering
- `POST /api/gigs` - Create new gig (sellers only)
- `GET /api/gigs/[id]` - Get single gig
- `DELETE /api/gigs/[id]` - Delete gig (owner only)

### Order Endpoints

- `GET /api/orders` - Get user orders
- `POST /api/orders/create-payment-intent/[id]` - Create Stripe payment intent
- `PUT /api/orders` - Confirm order completion

### Review Endpoints

- `GET /api/reviews/[gigId]` - Get gig reviews
- `POST /api/reviews` - Create review (buyers only)

### Message Endpoints

- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/messages/[conversationId]` - Get conversation messages
- `POST /api/messages` - Send new message

## 🎨 UI Components

The application uses Shadcn/ui components for consistent, accessible design:

- **Forms**: Input, Textarea, Select, Button
- **Layout**: Card, Separator, Avatar
- **Navigation**: Dropdown Menu, Breadcrumb
- **Feedback**: Toast, Loading states
- **Data Display**: Table, Badge, Carousel

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email/username
2. **Login**: Credential-based authentication via NextAuth
3. **Session Management**: JWT tokens with secure httpOnly cookies
4. **Role-based Access**: Different permissions for buyers/sellers
5. **Protected Routes**: Middleware protection for authenticated pages

## 💳 Payment Integration

- **Stripe Integration**: Secure payment processing
- **Payment Intents**: Server-side payment creation
- **Webhook Handling**: Order confirmation via Stripe webhooks
- **Error Handling**: Comprehensive payment error management

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch-friendly**: Appropriate touch targets and gestures
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Deployment

```bash

# Build the application

pnpm build

# Start production server

pnpm start
```

## 🧪 Development Tools

- **Prisma Studio**: Database GUI (`pnpm db:studio`)
- **TypeScript**: Type checking and IntelliSense
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Prisma for all database operations
- Implement proper error handling
- Write meaningful commit messages
- Test thoroughly before submitting PRs

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## 🔄 Changelog

### v1.0.0

- Initial release with core functionality
- User authentication and authorization
- Gig creation and management
- Order processing with Stripe
- Real-time messaging system
- Review and rating system
- Responsive design implementation

---
