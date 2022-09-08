import { PackageType } from '@package/install/models/package.model';

export interface Arguments {
  path: string;
  name: string;
  type: PackageType;
}
