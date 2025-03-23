# MidScense Scene Manager

A complete scene-based management service using MidScense library for creating, managing, and running 3D scenes.

## Features

- Create and manage 3D scenes with complex attributes
- Run scenes and track execution status
- View detailed execution steps and results
- Modern UI with real-time updates

## Tech Stack

- **Frontend**: Nuxt.js 3, Vue 3, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Libraries**: MidScense.js

## Prerequisites

- Node.js >= 16.0.0
- PNPM >= 7.0.0
- PostgreSQL >= 14.0

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mysop
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure the database:

The default configuration expects a PostgreSQL database with:
- Host: localhost
- Port: 5432
- Database name: mysop
- Username: admin
- Password: Admin123

You can modify these settings in `backend/.env` if needed.

4. Initialize the database:

```bash
pnpm -F backend migrate
```

## Running the Application

Start the development server:

```bash
pnpm dev
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Building for Production

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Project Structure

```
mysop/
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── controllers/  # API controllers
│   │   ├── db/           # Database models and migrations
│   │   ├── routes/       # API routes
│   │   └── index.js      # Main server file
├── frontend/          # Nuxt.js frontend
│   ├── assets/        # Static assets
│   ├── components/    # Vue components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Application pages
│   └── nuxt.config.js # Nuxt.js configuration
└── package.json      # Project configuration
```

## License

MIT License
