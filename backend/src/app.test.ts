import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';

const tmpCsv = path.join(os.tmpdir(), `transactions-test-${Date.now()}.csv`);
process.env.CSV_FILE_PATH = tmpCsv;

const { app } = await import('./app.js');

const header = 'Transaction Date,Account Number,Account Holder Name,Amount,Status\n';
const sampleRow = '2025-03-01,7289-3445-1121,Maria Johnson,150.00,Settled\n';

beforeEach(() => fs.writeFile(tmpCsv, header + sampleRow, 'utf-8'));
afterAll(() => fs.rm(tmpCsv, { force: true }));

describe('GET /transactions', () => {
  it('returns the stored transactions', async () => {
    const res = await request(app).get('/transactions');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      accountHolderName: 'Maria Johnson',
      amount: 150,
      status: 'Settled',
    });
  });
});

describe('POST /transactions', () => {
  const valid = {
    transactionDate: '2025-04-01',
    accountNumber: '1111-2222-3333',
    accountHolderName: 'Test User',
    amount: 99.5,
  };

  it('creates a transaction and assigns a valid random status', async () => {
    const res = await request(app).post('/transactions').send(valid);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(valid);
    expect(['Pending', 'Settled', 'Failed']).toContain(res.body.status);
  });

  it('persists the new transaction so it is returned by GET', async () => {
    await request(app).post('/transactions').send(valid);
    const res = await request(app).get('/transactions');

    expect(res.body).toHaveLength(2);
    expect(res.body[1].accountNumber).toBe('1111-2222-3333');
  });

  it('rejects invalid input with 400 and field-level details', async () => {
    const res = await request(app).post('/transactions').send({
      transactionDate: '2025-02-30',
      accountNumber: 'not-valid',
      accountHolderName: '',
      amount: -5,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    const fields = res.body.details.map((d: { field: string }) => d.field);
    expect(fields).toEqual(
      expect.arrayContaining(['transactionDate', 'accountNumber', 'accountHolderName', 'amount']),
    );
  });
});

describe('unknown routes', () => {
  it('returns 404', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
