import autocannon, { Result } from 'autocannon';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Types for scenario and test results
type TestScenario = {
  title: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Use specific HTTP method types
  headers: Record<string, string>;
  body?: string;
};

type TestResult = {
  scenario: string;
  result: Result;
};

// Ensure results directory exists
const resultsDir = path.join(__dirname, 'loadtest-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

// Timestamp for unique results file
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
const resultsFile = path.join(resultsDir, `results-${timestamp}.json`);

console.log('Starting load test...');
console.log('Make sure your server is running on port 5000');

// Define test scenarios
const scenarios: TestScenario[] = [
  {
    title: 'Get team locations',
    url: 'http://localhost:5000/api/location/team/team-456',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer test_token'
    },
  },
  {
    title: 'Update location',
    url: 'http://localhost:5000/api/location/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test_token'
    },
    body: JSON.stringify({
      userID: 'user-123',
      latitude: 6.9271,
      longitude: 79.8612,
      altitude: 10,
      speed: 5
    })
  }
];

// Update test tokens with real test tokens if available
if (process.env.TEST_AUTH_TOKEN) {
  scenarios.forEach(scenario => {
    scenario.headers.Authorization = `Bearer ${process.env.TEST_AUTH_TOKEN}`;
  });
} else {
  console.log('Note: No test auth token found in .env file, using dummy token');
}

// Run load tests sequentially
const runLoadTests = async (): Promise<void> => {
  const results: TestResult[] = [];
  
  for (const scenario of scenarios) {
    console.log(`Running test: ${scenario.title}`);
    
    const result = await new Promise<TestResult>((resolve) => {
      const instance = autocannon({
        url: scenario.url,
        method: scenario.method,
        headers: scenario.headers,
        body: scenario.body,
        connections: 10,
        duration: 10,
        requests: [
          {
            method: scenario.method,
            path: '/',
            headers: scenario.headers,
            body: scenario.body
          }
        ]
      }, (err: Error | null, result: Result) => {
        if (err) {
          console.error(err);
        }
        resolve({ scenario: scenario.title, result });
      });
      
      // Log progress to console
      autocannon.track(instance);
    });
    
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save results to file
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`Results saved to ${resultsFile}`);
  
  // Generate summary
  console.log('\nSummary:');
  results.forEach(({scenario, result}) => {
    console.log(`\n${scenario}:`);
    console.log(`  Requests/sec: ${result.requests.average}`);
    console.log(`  Latency (avg): ${result.latency.average} ms`);
    console.log(`  Latency (max): ${result.latency.max} ms`);
    console.log(`  HTTP errors: ${result.errors}`);
  });
};

// Run the load tests
exec('npm list autocannon || npm install --no-save autocannon', (error) => {
  if (error) {
    console.error(`Error installing autocannon: ${error}`);
    return;
  }
  
  runLoadTests().catch(console.error);
});

// Usage: 
// npx ts-node loadtest.ts 