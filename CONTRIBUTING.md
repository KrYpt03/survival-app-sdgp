# Contributing to the Survival App

Thank you for considering contributing to this project! This guide will help you understand our development workflow, coding standards, and how to effectively contribute to the codebase.

## Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/survival-app-sdgp.git
   cd survival-app-sdgp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Update with your configuration
   npm run dev
   ```

3. **Frontend Setup** 
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Development Workflow

1. **Create a feature branch**
   - Branch off from `development` branch
   - Use a descriptive name: `feature/feature-name` or `fix/issue-description`

2. **Make your changes**
   - Follow the coding standards
   - Write tests for your code
   - Keep commits small and focused

3. **Submit a pull request**
   - Make sure your branch is up to date with `development`
   - Fill out the PR template with details about your changes
   - Link any related issues

## Code Standards

### Backend (Node.js/Express/TypeScript)

- Use TypeScript for all new code
- Follow the layered architecture pattern (API → Application → Domain → Infrastructure)
- Validate all inputs with Zod schemas
- Write unit tests for business logic
- Handle errors properly with our error handling middleware

### Frontend (React/Next.js/TypeScript)

- Use functional components with hooks
- Use TypeScript for all new code
- Use appropriate state management (React Context, Redux, etc.)
- Follow responsive design principles

## Testing

- Write unit tests for all new features
- Run the full test suite before submitting a PR
  ```bash
  npm test
  ```
- Ensure your code passes all linting checks
  ```bash
  npm run lint
  ```

## Performance Considerations

- Use appropriate caching strategies
- Optimize database queries
- Keep bundle sizes small
- Test with the load testing tools in the `backend` directory

## Security Best Practices

1. **Input Validation**
   - Validate all inputs with Zod schemas
   - Don't trust user input

2. **Authentication/Authorization**
   - Always check user permissions
   - Use the provided middleware for authentication

3. **Data Protection**
   - Don't log sensitive information
   - Use proper error handling

## Database Migrations

- Create migrations for all schema changes
- Test migrations thoroughly
- Document any breaking changes

## Documentation

- Update API documentation when endpoints change
- Add JSDoc comments to functions and classes
- Update the README if necessary

## Deployment

See [DEPLOY.md](./docs/DEPLOY.md) for details on our deployment process.

## Getting Help

If you need help, reach out to the team on our communication channels or open an issue on GitHub.

Thank you for contributing! 