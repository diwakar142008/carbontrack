/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: ["js/**/*.js", "!js/animation.js"],
  coveragePathIgnorePatterns: ["/__tests__/", "/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/js/$1"
  },
  transform: {},
  setupFilesAfterEnv: []
};
