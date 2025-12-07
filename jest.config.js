/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  roots: ["<rootDir>/app"],
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  coverageThreshold: {
    global: {
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    "^.+\\.(ts|tsx)?$": ["ts-jest", {}],
  },
};
