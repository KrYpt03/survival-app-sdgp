const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DURATION = 10; // seconds
const CONNECTIONS = 10;
const REPORT_DIR = path.join(__dirname, 'load-test-reports');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

console.log(`Starting load test (${DURATION}s duration, ${CONNECTIONS} connections)`);
console.log('Server must be running on port 5000');

// Define test scenarios
const scenarios = [
  {
    name: 'health-check',
    url: 'http://localhost:5000/health',
    method: 'GET'
  },
  {
    name: 'user-listing',
    url: 'http://localhost:5000/api/user',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'team-listing',
    url: 'http://localhost:5000/api/team',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
];

// Run tests sequentially
async function runTests() {
  try {
    const results = {};
    
    for (const scenario of scenarios) {
      console.log(`Running scenario: ${scenario.name}`);
      
      const instance = autocannon({
        url: scenario.url,
        connections: CONNECTIONS,
        duration: DURATION,
        method: scenario.method,
        headers: scenario.headers || {}
      });
      
      const result = await new Promise((resolve) => {
        autocannon.track(instance);
        
        instance.on('done', resolve);
      });
      
      results[scenario.name] = result;
      
      // Delay between tests to let server recover
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate report
    console.log('Generating report...');
    
    const reportPath = path.join(REPORT_DIR, `load-test-${new Date().toISOString().replace(/:/g, '-')}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    
    console.log(`Report saved to: ${reportPath}`);
    
    // Print summary
    console.log('\n=== Load Test Summary ===');
    console.log('Endpoint | Avg Req/s | Avg Latency | Errors');
    console.log('---------|-----------|-------------|-------');
    
    for (const [name, result] of Object.entries(results)) {
      console.log(`${name.padEnd(9)} | ${result.requests.average.toFixed(2).padEnd(11)} | ${result.latency.average.toFixed(2)}ms`.padEnd(35) + ` | ${result.errors}`);
    }
    
    // Check the performance metrics from admin API
    console.log('\nChecking server performance metrics...');
    
    // If .env exists, try to get the admin API key
    let adminKey;
    try {
      const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
      const match = envFile.match(/ADMIN_API_KEY=["']?([^"'\r\n]+)/);
      if (match) {
        adminKey = match[1];
      }
    } catch (e) {
      console.log('Could not read admin API key from .env file');
    }
    
    if (adminKey && adminKey.length >= 32) {
      try {
        // Make a curl request to get metrics
        const command = `curl -s -X GET http://localhost:5000/api/admin/metrics -H "Content-Type: application/json" -d "{\\"adminKey\\":\\"${adminKey}\\"}" | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0, 'utf8')), null, 2))"`;
        const metrics = execSync(command, { stdio: 'pipe' }).toString();
        
        console.log('\nServer Performance Metrics:');
        console.log(metrics);
      } catch (e) {
        console.log('Error fetching metrics:', e.message);
      }
    } else {
      console.log('No admin API key available to fetch metrics');
    }
  } catch (error) {
    console.error('Error during load testing:', error);
  }
}

runTests();

// Usage:
// node loadtest.js 