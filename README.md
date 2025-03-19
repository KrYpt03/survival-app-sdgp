# Survival App - Team Tracking Application

A mobile application for tracking team members in survival scenarios, providing real-time location updates, geofencing, and emergency alerts.

## Features

- **Real-time Team Member Tracking**: See the current location of all team members on a map
- **Geofencing**: Get alerts when team members leave the designated area
- **Emergency Alerts**: Send emergency notifications to the team with your location
- **Team Management**: Create and join teams with a unique code
- **Secure Authentication**: User authentication powered by Clerk

## Project Structure

- `backend/`: Node.js Express backend with PostgreSQL database
- `frontend/`: React Native mobile application
- `docs/`: Project documentation

## Prerequisites

- Node.js 14+ and npm
- PostgreSQL 17 or Neon cloud database
- React Native development environment

## Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jithnukaofficial/survival-app-sdgp.git
   cd survival-app-sdgp/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and add your database and Clerk credentials.

4. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed database (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Mobile App Setup

1. **Navigate to the mobile directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to add your API URL and Clerk API keys.

4. **Start the app**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## Cloud Database Setup

We use Neon for our cloud PostgreSQL database. Follow the detailed setup instructions in [docs/DATABASE.md](docs/DATABASE.md).

## API Documentation

All available API endpoints are documented in [docs/API.md](docs/API.md).

## Deployment

For production deployment instructions, see [docs/DEPLOY.md](docs/DEPLOY.md).

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run mobile tests
cd mobile
npm test
```

## Project Architecture

### Backend

- **Express.js**: Web framework
- **Prisma**: ORM for database access
- **PostgreSQL**: Database
- **Clerk**: Authentication provider
- **Jest**: Testing framework

### Mobile

- **React Native**: Mobile app framework
- **React Navigation**: Navigation
- **Clerk**: Authentication
- **React Native Maps**: Map integration
- **Async Storage**: Local storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Clerk](https://clerk.dev/) for authentication
- [Neon](https://neon.tech) for serverless PostgreSQL
- [Prisma](https://prisma.io) for database ORM 