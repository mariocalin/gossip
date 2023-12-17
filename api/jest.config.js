module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: ['/e2e', '.int.test.ts']
};
