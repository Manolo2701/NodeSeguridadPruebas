module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePaths: ["<rootDir>"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};