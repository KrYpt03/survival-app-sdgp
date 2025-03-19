import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

// Add a health check endpoint for testing
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

describe('Health Check Endpoint', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
}); 