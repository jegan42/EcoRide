// backend/src/tests/app.test.ts
import request from 'supertest';
import app from '../app';

describe('App integration tests', () => {
  describe('GET /', () => {
    it('should respond with 200 and running message', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('EcoRide backend is running 🚗');
    });
  });

  describe('Helmet headers', () => {
    it('should set content-security-policy header', async () => {
      const res = await request(app).get('/');
      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain(
        "default-src 'self'"
      );
    });
  });

  describe('CORS headers', () => {
    it('should set Access-Control-Allow-Origin and credentials', async () => {
      const res = await request(app).get('/');
      expect(res.headers['access-control-allow-origin']).toBe(
        process.env.CLIENT_URL
      );
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Parsing middlewares', () => {
    it('should accept JSON body', async () => {
      app.post('/test-json', (req, res) => {
        res.json({ body: req.body });
      });

      const payload = { test: 'json' };
      const res = await request(app)
        .post('/test-json')
        .send(payload)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.body).toEqual(payload);
    });

    it('should accept urlencoded body', async () => {
      app.post('/test-urlencoded', (req, res) => {
        res.json({ body: req.body });
      });

      const payload = { test: 'urlencoded' };
      const res = await request(app)
        .post('/test-urlencoded')
        .send('test=urlencoded')
        .set('Content-Type', 'application/x-www-form-urlencoded');

      expect(res.status).toBe(200);
      expect(res.body.body).toEqual(payload);
    });
  });

  describe('API routes mounting', () => {
    it('should respond with 404 or any status on /api', async () => {
      const res = await request(app).get('/api');
      expect([200, 404, 401, 403]).toContain(res.status);
    });
  });
});

describe('App integration tests', () => {
  describe('GET /', () => {
    it('should respond with 200 and running message', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('EcoRide backend is running 🚗');
    });
  });
});
