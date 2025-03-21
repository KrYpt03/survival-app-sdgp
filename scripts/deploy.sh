#!/bin/bash

# Set default environment
ENVIRONMENT=${1:-dev}

# Check if environment is valid
if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
    echo "❌ Invalid environment. Please use 'dev' or 'prod'."
    exit 1
fi

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Generate certificates if they don't exist
if [ ! -f "nginx/ssl/server.crt" ]; then
    echo "🔒 Generating SSL certificates..."
    
    chmod +x scripts/generate-ssl-certs.sh
    ./scripts/generate-ssl-certs.sh
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to generate SSL certificates."
        exit 1
    fi
fi

# Create environment file if it doesn't exist
if [ "$ENVIRONMENT" = "prod" ]; then
    ENV_FILE="backend/.env.production"
    if [ ! -f "$ENV_FILE" ]; then
        echo "📄 Creating production environment file..."
        cp backend/.env.example "$ENV_FILE"
        echo "⚠️ Please edit the $ENV_FILE file with your production settings before continuing."
        
        read -p "Would you like to edit the file now? (y/n) " EDIT_FILE
        if [ "$EDIT_FILE" = "y" ]; then
            ${EDITOR:-vi} "$ENV_FILE"
        fi
    fi
fi

# Build and start containers
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "🏗️ Building and starting production containers..."
    docker-compose -f docker-compose.yml up -d --build
else
    echo "🏗️ Building and starting development containers..."
    docker-compose -f docker-compose.yml up -d --build
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to build and start containers."
    exit 1
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
SERVICES=$(docker-compose ps --services)
for SERVICE in $SERVICES; do
    STATUS=$(docker-compose ps "$SERVICE" | grep running)
    if [ -z "$STATUS" ]; then
        echo "⚠️ Service $SERVICE is not running. Checking logs..."
        docker-compose logs --tail=50 "$SERVICE"
        
        read -p "Continue anyway? (y/n) " CONTINUE
        if [ "$CONTINUE" != "y" ]; then
            exit 1
        fi
    else
        echo "✅ Service $SERVICE is running."
    fi
done

# Display health check
echo "🔍 Checking backend health..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
if [ "$HEALTH_STATUS" = "200" ]; then
    echo "✅ Backend health check passed."
    curl -s http://localhost:5000/health | json_pp
else
    echo "⚠️ Backend health check returned status code $HEALTH_STATUS."
fi

# Display URLs
if [ "$ENVIRONMENT" = "prod" ]; then
    echo -e "\n🚀 Deployment complete!"
    echo "📊 Application is running at: https://localhost"
    echo "🔌 API is available at: https://localhost/api"
    echo "💓 Health check is available at: https://localhost/health"
else
    echo -e "\n🚀 Development deployment complete!"
    echo "📊 Application is running at: https://localhost"
    echo "🔌 API is available at: https://localhost/api"
    echo "💓 Health check is available at: https://localhost/health"
    echo "📋 For local development, you can also use: http://localhost:5000"
fi

echo -e "\n💡 To view logs: docker-compose logs -f [service]"
echo "💡 To stop services: docker-compose down" 