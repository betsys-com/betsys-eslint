const createBaseJestConfig = require('../../jest.helper.cjs');
const { paths } = require('./tsconfig.spec').compilerOptions;

module.exports = createBaseJestConfig(paths);
