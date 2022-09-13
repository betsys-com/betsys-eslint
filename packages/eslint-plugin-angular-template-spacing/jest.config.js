const createBaseJestConfig = require('../../jest.helper');
const { paths } = require('./tsconfig.spec').compilerOptions;

module.exports = createBaseJestConfig(paths);
