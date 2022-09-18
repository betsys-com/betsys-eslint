const { pathsToModuleNameMapper } = require('ts-jest');

/** @returns {import('ts-jest/dist/types').InitialOptionsTsJest} */
/** @param paths {import('typescript').MapLike<string>} */
module.exports = createBaseJestConfig = (paths) => ({
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json'
    }
  }
});
