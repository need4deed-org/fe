# Need4Deed Frontend

Next.js application serving as the frontend for the Need4Deed platform.

## Overview

This frontend application is part of a three-repository system:

- **[`fe`](https://github.com/need4deed-org/fe)** (this repository) - Next.js frontend application
- **[`be`](https://github.com/need4deed-org/be)** - Fastify backend API with PostgreSQL database
- **[`sdk`](https://github.com/need4deed-org/sdk)** - Shared TypeScript SDK used by both frontend and backend

The frontend connects to the backend API and uses the shared SDK for type definitions and utilities.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** package manager
- **Docker** and **Docker Compose**

### 1. Clone Repositories

Clone all three repositories in the same parent directory:

```bash
# Create a parent directory
mkdir need4deed
cd need4deed

# Clone all repositories
git clone https://github.com/need4deed-org/fe.git
git clone https://github.com/need4deed-org/be.git
git clone https://github.com/need4deed-org/sdk.git
```

Your directory structure should look like:

```
need4deed/
├── fe/          # Frontend
├── be/          # Backend
└── sdk/         # SDK
```

### 2. Backend Setup

First, start the backend services:

```bash
# Navigate to backend directory
cd ../be

# Start Docker containers (PostgreSQL database)
docker-compose up -d

# Install dependencies
npm install

# Start backend server with CORS enabled
CORS_ORIGINS="http://localhost:3000" npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. SDK Setup

The frontend depends on a local SDK that needs to be built:

```bash
# Navigate to SDK directory (sibling to fe/ and be/)
cd ../sdk

# Install dependencies
yarn install

# Build the SDK
yarn build
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../fe

# Install dependencies
yarn install

# Start development server
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 🔐 Authentication

### Test Users

The backend includes pre-configured test users via seed files (`be/src/data/seeds/user.seed.ts`):

- **Admin**: `john.doe@need4deed.org` / `no_password` (ADMIN role)
- **Coordinator**: `sarah.doe@need4deed.org` / `no_password` (COORDINATOR role)
- **User**: `anna.doe@need4deed.org` / `no_password` (USER role)

All test users are pre-activated and ready to use.
