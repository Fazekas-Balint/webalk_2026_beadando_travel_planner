import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import prisma from '../src/lib/prisma';

describe('Activities Endpoints', () => {
  let user1Token: string;
  let user2Token: string;
  let tripId: string;
  let dayId: string;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const u1 = await request(app).post('/api/auth/register').send({
      email: 'owner@example.com',
      password: 'Password123!',
      name: 'Owner',
    });
    user1Token = u1.body.accessToken;

    const u2 = await request(app).post('/api/auth/register').send({
      email: 'stranger@example.com',
      password: 'Password123!',
      name: 'Stranger',
    });
    user2Token = u2.body.accessToken;

    const tripRes = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Activities Test Trip',
        destination: 'Berlin',
        startDate: '2026-08-01',
        endDate: '2026-08-03',
      });
    tripId = tripRes.body.id;
    dayId = tripRes.body.days[0].id;
  });

  describe('POST /api/trips/:id/activities', () => {
    it('should create an activity for the owner', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripId}/activities`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          dayId,
          title: 'Brandenburg Gate',
          time: '10:00',
          order: 0,
          cost: 0,
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Brandenburg Gate');
      expect(res.body.dayId).toBe(dayId);
    });

    it('should reject creation by another user with 404', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripId}/activities`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          dayId,
          title: 'Sneaky',
          order: 0,
        });

      expect(res.status).toBe(404);
    });

    it('should reject if dayId is missing', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripId}/activities`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          title: 'No day',
          order: 0,
        });

      expect(res.status).toBe(400);
    });

    it('should reject if title is empty', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripId}/activities`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          dayId,
          title: '',
          order: 0,
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/trips/${tripId}/activities`)
        .send({
          dayId,
          title: 'No auth',
          order: 0,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/activities/:id', () => {
    let activityId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/trips/${tripId}/activities`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          dayId,
          title: 'Original',
          order: 0,
          cost: 100,
        });
      activityId = res.body.id;
    });

    it('should update an activity for the owner', async () => {
      const res = await request(app)
        .patch(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'Updated', cost: 250 });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
      expect(res.body.cost).toBe(250);
    });

    it('should return 404 when another user tries to edit', async () => {
      const res = await request(app)
        .patch(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'Hijacked' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/activities/:id', () => {
    let activityId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/trips/${tripId}/activities`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          dayId,
          title: 'To delete',
          order: 0,
        });
      activityId = res.body.id;
    });

    it('should delete an activity owned by the user', async () => {
      const res = await request(app)
        .delete(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 when another user tries to delete', async () => {
      const res = await request(app)
        .delete(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(404);
    });
  });
});
