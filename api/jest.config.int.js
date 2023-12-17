module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/*.int.test.ts'],
  testPathIgnorePatterns: ['/e2e']
};
