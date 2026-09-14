import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './index';

describe('API Server Endpoints', () => {
  const app = createApp();

  test('GET /health returns healthy status', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'HEALTHY');

    server.close();
  });

  test('GET /api/v1/jobs returns verified jobs from database repository', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/jobs`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.total >= 10, 'Expected at least 10 seeded official jobs');
    assert.ok(body.data[0].slug.length > 0);

    server.close();
  });

  test('GET /api/v1/jobs/search finds relevant government jobs', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/jobs/search?q=upsc`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.length >= 1);
    assert.ok(body.data[0].title.toLowerCase().includes('upsc'));

    server.close();
  });

  test('GET /api/v1/admin/analytics returns live operational metrics', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;

    const res = await fetch(`http://localhost:${port}/api/v1/admin/analytics`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.totalJobs >= 10);
    assert.ok(body.data.published >= 10);

    server.close();
  });
});
