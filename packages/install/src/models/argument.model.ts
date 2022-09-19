import { PackageType } from '@package/src/models/package.model';

export interface Arguments {
    path: string;
    name: string;
    type: PackageType;
}
