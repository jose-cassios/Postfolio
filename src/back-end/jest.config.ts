import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@PrismaGen/(.*)$": "<rootDir>/src/prisma/generated/$1",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
};

export default config;
