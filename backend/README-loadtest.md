# API Load Testing Tool

This tool allows you to run performance tests against the Survival App API endpoints to measure throughput, latency, and error rates under load.

## What it tests

1. **Team Location Retrieval** - `GET /api/location/team/team-456`
2. **Location Updates** - `POST /api/location/update`

## Metrics captured

- Requests per second (throughput)
- Response latency (average and maximum)
- HTTP error counts
- Other performance metrics

## How to run

Make sure your server is running on port 5000 first, then:

### JavaScript version
```
node loadtest.js
```

### TypeScript version
```
npm install -g ts-node
ts-node --esm loadtest.ts
```

## Test configuration

You can modify the test scenarios in the `scenarios` array to test different endpoints, or adjust the test parameters:

- `connections`: Number of concurrent connections (default: 10)
- `duration`: Test duration in seconds (default: 10)

## Authentication

For endpoints requiring authentication, you can set a test auth token in your .env file:
```
TEST_AUTH_TOKEN=your_token_here
```

## Results

Test results are saved to the `loadtest-results` directory with timestamps for historical comparison. 