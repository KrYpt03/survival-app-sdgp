# Deployment Guide

This guide provides instructions for deploying the Survival App to various environments, including local development, staging, and production.

## Prerequisites

- Node.js 22.x (LTS)
- Docker and Docker Compose
- PostgreSQL (if not using containerized version)
- OpenSSL (for generating SSL certificates)

## Local Development Deployment

### 1. Clone the repository

```bash
git clone <repository-url>
cd survival-app-sdgp
```

### 2. Set up environment variables

Copy the example environment file and update it with your values:

```bash
cp backend/.env.example backend/.env
```

Edit the `.env` file with your configuration values, especially:
- `DATABASE_URL`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### 3. Install dependencies

```bash
cd backend
npm install
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

## Docker Development Deployment

### 1. Generate SSL certificates for HTTPS

For Linux/macOS:
```bash
chmod +x scripts/generate-ssl-certs.sh
./scripts/generate-ssl-certs.sh
```

For Windows (PowerShell):
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
./scripts/generate-ssl-certs.ps1
```

### 2. Set up environment variables

Create a production environment file:
```bash
cp backend/.env.example backend/.env.production
```

Update the values in `.env.production` for your production environment.

### 3. Build and start the containers

```bash
docker-compose up -d
```

This will:
- Build the backend service
- Start the PostgreSQL database
- Start the Redis cache
- Configure NGINX as a reverse proxy

### 4. Verify the deployment

Visit https://localhost to see the application running.

The API will be available at https://localhost/api and the health check at https://localhost/health.

## Production Deployment

For production deployment, follow these additional steps:

### 1. Update the NGINX configuration

Edit `nginx/conf/default.conf` to use your actual domain name instead of `localhost`.

### 2. Use proper SSL certificates

Replace the self-signed certificates in `nginx/ssl/` with proper certificates from a trusted certificate authority.

### 3. Configure Docker for production

Update the `docker-compose.yml` file:

```yaml
version: "3.9"

services:
  backend:
    build:
      context: ./backend
      target: production
    restart: always  # Changed from unless-stopped
    # ... other settings
```

### 4. Set up a persistent database

For production, consider using a managed database service like AWS RDS, Azure Database for PostgreSQL, or Google Cloud SQL.

Update your `.env.production` file to point to your production database.

### 5. Set up monitoring and logging

Consider adding:
- Prometheus for metrics collection
- Grafana for visualization
- ELK stack for centralized logging

### 6. Configure CI/CD pipeline

Consider using GitHub Actions, GitLab CI, or Jenkins to automate your deployment process.

## Cloud Deployment Options

### AWS

1. Create an ECR repository for your Docker images
2. Deploy using ECS or EKS
3. Use RDS for PostgreSQL
4. Configure an Application Load Balancer
5. Set up Auto Scaling

### Azure

1. Deploy to Azure Container Instances or AKS
2. Use Azure Database for PostgreSQL
3. Configure Azure Front Door
4. Set up Azure Monitor

### Google Cloud

1. Deploy to Google Cloud Run or GKE
2. Use Cloud SQL for PostgreSQL
3. Configure Cloud Load Balancing
4. Set up Cloud Monitoring

## Security Considerations

1. Never commit `.env` files containing sensitive information to version control
2. Regularly update dependencies to patch vulnerabilities
3. Implement proper rate limiting and authentication
4. Use proper SSL/TLS certificates
5. Follow the principle of least privilege for all services
6. Regularly back up your database
7. Implement a disaster recovery plan

## Troubleshooting

### Common Issues

1. **Database connection errors**: Verify your `DATABASE_URL` is correct and the database is accessible from your container
2. **NGINX not serving the API**: Check the NGINX logs and ensure the backend service is running
3. **SSL certificate issues**: Ensure your certificates are properly configured and trusted by your browser

### Helpful Commands

```bash
# View container logs
docker-compose logs -f backend

# Check the health of all services
docker-compose ps

# Restart a specific service
docker-compose restart backend

# Reset everything and start fresh
docker-compose down -v
docker-compose up -d
```

## Maintenance

### Updating the application

1. Pull the latest changes from the repository
2. Rebuild and restart the containers:
```bash
docker-compose build
docker-compose up -d
```

### Database migrations

When the database schema changes:

```bash
# Apply migrations
npx prisma migrate deploy
```

## Backup and Restore

### Database backup

```bash
# Using pg_dump (adjust parameters as needed)
docker-compose exec db pg_dump -U postgres -d your_database > backup.sql
```

### Database restore

```bash
# Using psql (adjust parameters as needed)
cat backup.sql | docker-compose exec -T db psql -U postgres -d your_database
``` 