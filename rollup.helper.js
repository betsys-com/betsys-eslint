import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

/**
 * @returns {import('rollup').RollupOptions}
 */
export const createBaseRollupConfig = () => ({
  input: 'src/index.ts',
  output: {
    format: 'cjs',
    name: 'version',
    plugins: [terser()],
    file: 'dist/index.min.js',
  },
  plugins: [
    typescript(),
    nodeResolve(),
  ],
});
