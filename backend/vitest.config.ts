import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  test: {
    exclude: ['dist/**', 'node_modules/**'],
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL as string,
      JWT_SECRET: process.env.JWT_SECRET || 'test_secret_that_is_at_least_32_characters_long',
    }
  }
});
