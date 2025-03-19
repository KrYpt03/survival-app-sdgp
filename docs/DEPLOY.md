# Deployment Guide for Survival App Backend

This guide explains how to deploy the Survival App backend to a production environment.

## Prerequisites

- Node.js 14+ and npm installed on your server
- Git access to the repository
- Neon database already configured (see DATABASE.md)
- Clerk account with API keys

## Option 1: Deploy to Render (Recommended)

Render offers a simple, cost-effective way to deploy Node.js applications with a generous free tier.

### Steps:

1. **Create a Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub account

2. **Create a New Web Service**
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Fill in the details:
     - Name: `survival-app-backend`
     - Region: Choose closest to your users
     - Branch: `development`
     - Root Directory: `backend`
     - Runtime: `Node`
     - Build Command: `npm install && npx prisma generate`
     - Start Command: `npm start`

3. **Set Environment Variables**
   - Add the following environment variables:
     - `DATABASE_URL`: Your Neon database URL
     - `CLERK_WEBHOOK_SECRET`: Your Clerk webhook secret
     - `PORT`: `10000` (Render assigns this internally)
     - `NODE_ENV`: `production`
     - `DEFAULT_GEOFENCE_RANGE`: `100`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete

5. **Configure Clerk Webhook**
   - Go to your Clerk Dashboard → Webhooks
   - Create a new endpoint using your Render URL:
     ```
     https://survival-app-backend.onrender.com/api/user/webhook
     ```
   - Set up the following events:
     - `user.created`
     - `user.updated`
     - `user.deleted`

## Option 2: Deploy to DigitalOcean Droplet

For more control and scalability, you can deploy to a DigitalOcean Droplet.

### Steps:

1. **Create a Droplet**
   - Sign up at [digitalocean.com](https://digitalocean.com)
   - Create a basic Droplet ($5/month option):
     - Choose Ubuntu 20.04
     - Basic plan
     - Regular CPU
     - Choose a datacenter region close to your users
     - Add your SSH key or create a password

2. **Set Up the Server**
   - SSH into your server:
     ```bash
     ssh root@your_server_ip
     ```
   - Update packages:
     ```bash
     apt update && apt upgrade -y
     ```
   - Install Node.js:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
     apt install -y nodejs
     ```
   - Install PM2 (process manager):
     ```bash
     npm install -g pm2
     ```

3. **Deploy the Application**
   - Clone your repository:
     ```bash
     git clone https://github.com/yourusername/survival-app-sdgp.git
     cd survival-app-sdgp/backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create .env file:
     ```bash
     nano .env
     ```
     Add your environment variables:
     ```
     DATABASE_URL=your_neon_database_url
     CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
     PORT=5000
     NODE_ENV=production
     DEFAULT_GEOFENCE_RANGE=100
     ```
   - Build and generate Prisma client:
     ```bash
     npx prisma generate
     ```
   - Start with PM2:
     ```bash
     pm2 start npm --name "survival-backend" -- start
     pm2 save
     pm2 startup
     ```

4. **Set Up Nginx as Reverse Proxy**
   - Install Nginx:
     ```bash
     apt install -y nginx
     ```
   - Configure Nginx:
     ```bash
     nano /etc/nginx/sites-available/survival-app
     ```
     Add the following configuration:
     ```nginx
     server {
         listen 80;
         server_name your_server_ip_or_domain;
     
         location / {
             proxy_pass http://localhost:5000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }
     }
     ```
   - Enable the site:
     ```bash
     ln -s /etc/nginx/sites-available/survival-app /etc/nginx/sites-enabled/
     nginx -t
     systemctl restart nginx
     ```

5. **Set Up SSL (Optional but Recommended)**
   - Install Certbot:
     ```bash
     apt install -y certbot python3-certbot-nginx
     ```
   - Obtain SSL certificate:
     ```bash
     certbot --nginx -d your_domain.com
     ```

## Option 3: Deploy to Railway

Railway offers a simple deployment solution with Git integration.

### Steps:

1. **Create a Railway Account**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub account

2. **Deploy Your Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Find and select your repository
   - Configure the deployment:
     - Root Directory: `backend`
     - Build Command: `npm install && npx prisma generate`
     - Start Command: `npm start`

3. **Set Environment Variables**
   - Click on your project → Variables
   - Add the same environment variables as in the Render option

4. **Generate a Domain**
   - Go to Settings → Domains
   - Click "Generate Domain"
   - Use this domain for your Clerk webhook configuration

## Update Mobile App for Production

After deploying your backend, update your mobile app configuration:

1. Create a production configuration in your mobile app:
   ```javascript
   // config.js
   const DEV_API_URL = 'http://localhost:5000';
   const PROD_API_URL = 'https://your-deployed-backend-url';
   
   export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
   ```

2. Update your Clerk configuration to use the production keys

## Continuous Deployment (Optional)

Set up GitHub Actions for continuous deployment to your chosen platform:

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy Backend
   
   on:
     push:
       branches: [ development ]
       paths:
         - 'backend/**'
   
   jobs:
     test:
       # Your existing test job
     
     deploy:
       needs: test
       runs-on: ubuntu-latest
       if: success()
       steps:
         - uses: actions/checkout@v3
         
         # For Render deployment
         - name: Deploy to Render
           run: |
             curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
   ```

2. Set up the deploy hook in your hosting provider

## Monitoring and Logging

For production monitoring:

- Set up logging with a service like [LogDNA](https://www.logdna.com/) or [Papertrail](https://www.papertrail.com/)
- Monitor performance with [New Relic](https://newrelic.com/) or [Datadog](https://www.datadoghq.com/)
- Set up alerts for errors and downtime

## Troubleshooting Deployment Issues

- **Database Connection Issues**: Verify the Neon connection string and check network rules
- **Server Crashes**: Check logs using `pm2 logs` or your hosting provider's log interface
- **Webhook Failures**: Verify the Clerk webhook URL and secret are correctly configured
- **CORS Issues**: Ensure your CORS configuration allows requests from your mobile app domain 