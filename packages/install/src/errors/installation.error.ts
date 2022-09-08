export class InstallationError extends Error {
  constructor(e: unknown) {
    super(`Installation failed. ${e}`);
  }
}
