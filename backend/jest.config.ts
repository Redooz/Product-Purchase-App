import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['.'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/modules/**/*.ts'],
  coveragePathIgnorePatterns: [
    '.*\\.model\\.ts$',
    '/src/modules/.*/(model|entity|dto|decorator)/',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src/migrations/',
    '/src/integration-tests/',
    '/src/e2e-tests/',
    '/src/modules/.*/(model|entity|dto)/',
  ],
  moduleNameMapper: {
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^@/modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@/auth/(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@/product/(.*)$': '<rootDir>/src/modules/product/$1',
    '^@/customer/(.*)$': '<rootDir>/src/modules/customer/$1',
    '^@/transaction/(.*)$': '<rootDir>/src/modules/transaction/$1',
  },
};

export default config;
