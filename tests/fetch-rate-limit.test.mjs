import { expect, test } from 'bun:test';
import { config } from '../functions/fetch/fetch.mjs';

test('rate-limits the public fetch function per client IP', () => {
  expect(config).toEqual({
    path: '/.netlify/functions/fetch',
    rateLimit: {
      windowLimit: 10,
      windowSize: 60,
      aggregateBy: ['ip', 'domain']
    }
  });
});
