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

## Deployment

### Deploying to Render

1. Sign up for a [Render account](https://render.com/)

2. Create a new Web Service from your GitHub repository

3. Configure the following settings:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Make sure to add all required environment variables from `.env.example`, especially:
     - `DATABASE_URL`
     - `CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - `NODE_ENV=production`

4. Set up a PostgreSQL database on Render or elsewhere, and connect it using the `DATABASE_URL` environment variable

5. Important Notes:
   - Make sure your repository includes the `prisma/schema.prisma` file
   - The Dockerfile in this repository is configured to correctly handle Prisma schema generation during the build process
   - If you encounter the "Could not find Prisma Schema" error, check that the production stage in your Dockerfile copies the Prisma schema files before running npm install

### Using the Dockerfile

If deploying with the Dockerfile, make sure it's configured correctly:

```dockerfile
# Copy Prisma schema first - this needs to be before npm ci
COPY --from=builder /app/prisma /app/prisma
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production
```

### Build Output Note

When built with TypeScript, the compiled JavaScript files are output to the `dist/src` directory, not directly in `dist`. Make sure your start command points to the correct location:

```json
"scripts": {
  "start": "node dist/src/index.js"
}
```

And if using a Dockerfile, set the CMD to:

```dockerfile
CMD ["node", "dist/src/index.js"]
```

## License

This project is licensed under the ISC License.
