import { PackageType } from '@package/install/models/package.model';

export interface Arguments {
  name: string;
  type: PackageType;
}
