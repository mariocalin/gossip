module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/*.test.int.ts'],
  testPathIgnorePatterns: ['/e2e']
};
