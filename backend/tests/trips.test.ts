import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import prisma from '../src/lib/prisma';

describe('Trips Endpoints', () => {
  let user1Token: string;
  let user2Token: string;
  let user1Id: string;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const u1 = await request(app).post('/api/auth/register').send({
      email: 'user1@example.com',
      password: 'Password123!',
      name: 'User One',
    });
    user1Token = u1.body.accessToken;
    user1Id = u1.body.user.id;

    const u2 = await request(app).post('/api/auth/register').send({
      email: 'user2@example.com',
      password: 'Password123!',
      name: 'User Two',
    });
    user2Token = u2.body.accessToken;
  });

  describe('POST /api/trips', () => {
    it('should create a trip and automatically generate days', async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Budapest Weekend',
          destination: 'Budapest, Hungary',
          startDate: '2026-06-01',
          endDate: '2026-06-03',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Budapest Weekend');
      expect(res.body.userId).toBe(user1Id);

      expect(res.body.days).toHaveLength(3);
      expect(res.body.days[0].order).toBe(0);
      expect(res.body.days[2].order).toBe(2);
    });

    it('should fail if endDate is before startDate', async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'Time Travel',
          destination: 'Nowhere',
          startDate: '2026-06-05',
          endDate: '2026-06-01', 
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });
  });

  describe('GET & DELETE /api/trips', () => {
    let tripId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'User 1 Trip',
          destination: 'Paris',
          startDate: '2026-07-01',
          endDate: '2026-07-05',
        });
      tripId = res.body.id;
    });

    it('should list only trips belonging to the logged-in user', async () => {
      const res1 = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res1.status).toBe(200);
      expect(res1.body).toHaveLength(1);

      const res2 = await request(app)
        .get('/api/trips')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res2.status).toBe(200);
      expect(res2.body).toHaveLength(0);
    });

    it('should allow fetching a single trip if owned', async () => {
      const res = await request(app)
        .get(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(tripId);
      expect(res.body.days).toBeDefined();
    });

    it('should return 404 if trying to fetch another user\'s trip', async () => {
      const res = await request(app)
        .get(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${user2Token}`);
      
      expect(res.status).toBe(404);
    });

    it('should delete a trip if owned', async () => {
      const res = await request(app)
        .delete(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(204);

      const checkRes = await request(app)
        .get(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(checkRes.status).toBe(404);
    });

    it('should prevent deleting another user\'s trip', async () => {
      const res = await request(app)
        .delete(`/api/trips/${tripId}`)
        .set('Authorization', `Bearer ${user2Token}`);
      
      expect(res.status).toBe(404);
    });
  });
});