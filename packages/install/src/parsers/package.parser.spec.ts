import { Buffer } from 'buffer';
import { PackageParser } from '@package/parsers/package.parser';
import type { PackageType } from '@package/models/package.model';
import { InstallationError } from '@package/errors/installation.error';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: (path: string): boolean => path.startsWith('/exists'),
  readFileSync: (): Buffer => Buffer.from('{"peerDependencies":{"peerDep":"version-1", "peerDep2":"version-1"}}', 'utf-8'),
}));

describe('Package Parser', () => {
  let parser: PackageParser;

  beforeEach(() => {
    parser = new PackageParser();
  });

  it('should create', () => {
    expect(parser).toBeTruthy();
  });

  it.each(['', null])('should throw on invalid path. Using: %s', async (path) => {
    try {
      await parser.parse(path);
    } catch (e) {
      expect(e).toBeInstanceOf(InstallationError);
      expect((e as InstallationError).message).toContain('Unable to locate package.json file.');
    }
  });

  it('should throw on non existent path', (done) => {
    parser.parse('/non-existent/package.json').catch(e => {
      expect(e).toBeInstanceOf(InstallationError);
      expect((e as InstallationError).message).toContain('Unable to locate package.json file.');
      done();
    });
  });

  it('should return an array of installable strings from peerDependencies', async () => {
    const result = await parser.parse('/exists/package.json');
    expect(result).toEqual(['peerDep@"version-1"', 'peerDep2@"version-1"']);
  });

  it.each(['config', 'plugin'])('should create package name from type and name. Using %s', (packageType: string) => {
    expect(PackageParser.createName((packageType as PackageType), 'name')).toBe(`eslint-${packageType}-name`);
  });

  it.each([
    '@namespace/package',
    '@namespace/package@',
    '@namespace/package@14',
    '@namespace/package@"~12.0.0"',
    '@namespace/package@"^12.0.0"',
    '@namespace/package@">= 12.0.0"',
  ])('should strip the package version and return the name. Using %s', (packageName: string) => {
    expect(PackageParser.stripVersion(packageName)).toBe('@namespace/package');
  });
});
