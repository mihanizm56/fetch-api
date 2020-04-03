module.exports = {
  roots: ['<rootDir>/integrational-tests'],
  transform: {
    // '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  testRegex: '(/tests/.*|(\\.|/)(test))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/lib/$1',
  },
  collectCoverageFrom: ['lib/**/*.ts', '!**/node_modules/**', '!**/vendor/**'],
  coverageDirectory: '<rootDir>/coverage',
  browser: false,
};
