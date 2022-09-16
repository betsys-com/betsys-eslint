import { PackageType } from '@package/models/package.model';

export function resolvePackageName(packageType: PackageType, name: string): string {
  return `@betsys-eslint/eslint-${packageType}-${name}`;
}

export function stripPackageVersion(packageWithVersion: string): string {
  const matches = packageWithVersion.matchAll(/(.+)@(.*)/g);
  return Array.from(matches)?.[0]?.[1] ?? packageWithVersion;
}
