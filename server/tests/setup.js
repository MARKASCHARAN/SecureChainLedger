// tests/setup.js
// Loads .env.test before test runs. Sets NODE_ENV=test.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
process.env.NODE_ENV = 'test';
