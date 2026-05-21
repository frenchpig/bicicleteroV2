const nextJest = require('next/jest');
const path = require('path');

const createJestConfig = nextJest({ dir: './' });

const libsTypes = path.join(__dirname, '../../libs/types/src/index.ts');
const libsUi = path.join(__dirname, '../../libs/ui/src/index.ts');

module.exports = createJestConfig({
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/types$': libsTypes,
    '^@app/ui$': libsUi,
    '^@app/config$': path.join(__dirname, '../../libs/config/src/index.ts'),
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
});
