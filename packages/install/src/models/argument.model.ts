import { PackageType } from '@package/models/package.model';

export interface Arguments {
  path: string;
  name: string;
  type: PackageType;
}
