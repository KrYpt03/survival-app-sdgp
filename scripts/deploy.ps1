param (
    [ValidateSet('dev', 'prod')]
    [string]$Environment = 'dev'
)

Write-Host "🚀 Starting deployment for $Environment environment..." -ForegroundColor Cyan

# Ensure Docker is running
if (-not (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️ Docker Desktop is not running. Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Generate certificates if they don't exist
if (-not (Test-Path -Path "nginx\ssl\server.crt")) {
    Write-Host "🔒 Generating SSL certificates..." -ForegroundColor Blue
    
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    & .\scripts\generate-ssl-certs.ps1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to generate SSL certificates." -ForegroundColor Red
        exit 1
    }
}

# Create environment file if it doesn't exist
if ($Environment -eq 'prod') {
    $envFile = "backend\.env.production"
    if (-not (Test-Path -Path $envFile)) {
        Write-Host "📄 Creating production environment file..." -ForegroundColor Blue
        Copy-Item -Path "backend\.env.example" -Destination $envFile
        Write-Host "⚠️ Please edit the $envFile file with your production settings before continuing." -ForegroundColor Yellow
        
        $editFile = Read-Host "Would you like to edit the file now? (y/n)"
        if ($editFile -eq 'y') {
            Start-Process notepad.exe -ArgumentList $envFile -Wait
        }
    }
}

# Build and start containers
if ($Environment -eq 'prod') {
    Write-Host "🏗️ Building and starting production containers..." -ForegroundColor Blue
    docker-compose -f docker-compose.yml up -d --build
} else {
    Write-Host "🏗️ Building and starting development containers..." -ForegroundColor Blue
    docker-compose -f docker-compose.yml up -d --build
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build and start containers." -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 10

# Check if services are running
$services = docker-compose ps --services | Where-Object { $_ }
foreach ($service in $services) {
    $status = docker-compose ps $service | Select-String "running"
    if (-not $status) {
        Write-Host "⚠️ Service $service is not running. Checking logs..." -ForegroundColor Yellow
        docker-compose logs --tail=50 $service
        
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne 'y') {
            exit 1
        }
    } else {
        Write-Host "✅ Service $service is running." -ForegroundColor Green
    }
}

# Display health check
Write-Host "🔍 Checking backend health..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend health check passed." -ForegroundColor Green
        Write-Host $response.Content
    } else {
        Write-Host "⚠️ Backend health check returned status code $($response.StatusCode)." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Failed to reach backend health endpoint: $_" -ForegroundColor Yellow
}

# Display URLs
if ($Environment -eq 'prod') {
    Write-Host "`n🚀 Deployment complete!" -ForegroundColor Green
    Write-Host "📊 Application is running at: https://localhost" -ForegroundColor Cyan
    Write-Host "🔌 API is available at: https://localhost/api" -ForegroundColor Cyan
    Write-Host "💓 Health check is available at: https://localhost/health" -ForegroundColor Cyan
} else {
    Write-Host "`n🚀 Development deployment complete!" -ForegroundColor Green
    Write-Host "📊 Application is running at: https://localhost" -ForegroundColor Cyan
    Write-Host "🔌 API is available at: https://localhost/api" -ForegroundColor Cyan
    Write-Host "💓 Health check is available at: https://localhost/health" -ForegroundColor Cyan
    Write-Host "📋 For local development, you can also use: http://localhost:5000" -ForegroundColor Cyan
}

Write-Host "`n💡 To view logs: docker-compose logs -f [service]" -ForegroundColor White
Write-Host "💡 To stop services: docker-compose down" -ForegroundColor White 