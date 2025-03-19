# Survival App Backend

This is the backend API for the Survival App, providing team tracking and coordination features.

## Features

- Real-time location tracking for team members
- Team creation and management
- Geofencing and alerts for out-of-range team members
- Emergency alert system

## Tech Stack

- Node.js & Express
- TypeScript
- PostgreSQL with Prisma ORM
- Authentication with Clerk
- Zod for validation
- Jest for testing

## Development

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Clerk account for authentication

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`
5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Seed the database:
   ```bash
   npx prisma db seed
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

The project follows a clean architecture approach with clear separation of concerns:

- `/src/api` - API routes and controllers
- `/src/application` - Business logic and use cases
- `/src/domain` - Domain models and interfaces
- `/src/infrastructure` - Database and external services
- `/prisma` - Database schema and migrations

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run optimize-db` - Run database optimizations and create indexes
- `npm run db:health` - Run database health check and generate report
- `npm run lint` - Check code for errors
- `npm run lint:fix` - Fix linting errors automatically

## Database Optimization

The project includes tools for optimizing database performance:

- To add performance indexes:
  ```bash
  npm run optimize-db
  ```

- To generate a database health report:
  ```bash
  npm run db:health
  ```

The health report includes information about table sizes, row counts, potential missing indexes, and slow queries.

## Performance Monitoring

The application includes built-in performance monitoring. Admin metrics are available at:

- `GET /api/admin/metrics` - Get performance metrics
- `POST /api/admin/metrics/reset` - Reset performance metrics
- `POST /api/admin/cache/clear` - Clear API cache
- `GET /api/admin/health` - Get system health information

All admin endpoints require an admin API key that should be set in your environment variables.

## API Documentation

API documentation is available in the `/docs` folder:

- `/docs/API.md` - API reference
- `/docs/DEPLOY.md` - Deployment guide

## Contributing

Please see the [CONTRIBUTING.md](../CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the ISC License.
