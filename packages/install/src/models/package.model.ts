export type PackageType = 'plugin' | 'config';

export class Package {
    peerDependencies: Record<string, string> = {};

    constructor(contents: string) {
        try {
            this.peerDependencies = JSON.parse(contents)?.peerDependencies ?? {};
        } catch (e) {
            throw new Error('Unable to parse package.json contents');
        }
    }
}
