export class ArgumentValidationError extends Error {
  constructor(argumentName: string, argumentValue: string) {
    super(`Validation failed for argument ${argumentName}. Incorrect value provided: "${argumentValue}".`);
  }
}
