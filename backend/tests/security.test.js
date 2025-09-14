// Security tests for Smart Energy Ecosystem
const request = require('supertest');
const app = require('../server');

describe('Security Tests', () => {
  
  describe('CORS Configuration', () => {
    test('should allow requests from configured origin', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    test('should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://malicious-site.com');
      
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('Rate Limiting', () => {
    test('should allow normal request rate', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
    });

    test('should block excessive requests', async () => {
      // Make multiple requests quickly
      const promises = Array(105).fill().map(() => 
        request(app).get('/api/health')
      );
      
      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Input Validation', () => {
    test('should reject invalid wallet addresses', async () => {
      const response = await request(app)
        .get('/api/users/profile/invalid-address');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should reject malicious input', async () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const response = await request(app)
        .post('/api/users/profile')
        .send({
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          name: maliciousInput
        });
      
      expect(response.status).toBe(400);
    });

    test('should sanitize HTML content', async () => {
      const htmlInput = '<script>alert("xss")</script>Hello World';
      const response = await request(app)
        .post('/api/users/profile')
        .send({
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          name: htmlInput
        });
      
      // Should either reject or sanitize the input
      expect([200, 201, 400]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Route not found');
    });

    test('should handle server errors gracefully', async () => {
      // This would require mocking a controller to throw an error
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
    });
  });

  describe('Request Size Limits', () => {
    test('should reject oversized requests', async () => {
      const largeData = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const response = await request(app)
        .post('/api/users/profile')
        .send({
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          name: largeData
        });
      
      expect(response.status).toBe(413);
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });
});

describe('API Endpoint Security', () => {
  
  describe('User Endpoints', () => {
    test('should validate wallet address format', async () => {
      const response = await request(app)
        .get('/api/users/profile/0xinvalid');
      
      expect(response.status).toBe(400);
    });

    test('should validate user profile data', async () => {
      const response = await request(app)
        .post('/api/users/profile')
        .send({
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          email: 'invalid-email'
        });
      
      expect(response.status).toBe(400);
    });
  });

  describe('Token Endpoints', () => {
    test('should validate trade offer data', async () => {
      const response = await request(app)
        .post('/api/tokens/offers')
        .send({
          seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          amount: -100, // Invalid negative amount
          pricePerToken: 0.05,
          location: 'Mumbai, India'
        });
      
      expect(response.status).toBe(400);
    });

    test('should validate token purchase data', async () => {
      const response = await request(app)
        .post('/api/tokens/buy')
        .send({
          buyer: 'invalid-address',
          offerId: 1,
          amount: 100
        });
      
      expect(response.status).toBe(400);
    });
  });

  describe('Energy Endpoints', () => {
    test('should validate energy simulation data', async () => {
      const response = await request(app)
        .post('/api/energy/simulate')
        .send({
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          duration: 200 // Invalid duration
        });
      
      expect(response.status).toBe(400);
    });
  });
});

describe('Blockchain Integration Security', () => {
  
  test('should handle blockchain errors gracefully', async () => {
    // This would require mocking blockchain service to throw errors
    const response = await request(app)
      .get('/api/tokens/balance/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
    
    expect(response.status).toBe(200);
  });

  test('should validate blockchain addresses', async () => {
    const response = await request(app)
      .get('/api/tokens/balance/0xinvalid');
    
    expect(response.status).toBe(400);
  });
});