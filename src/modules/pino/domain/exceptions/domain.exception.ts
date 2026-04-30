/**
 * This layer is used for business logic errors, preventing technical errors from being thrown in the domain layer.
 * You must raise DomainException errores instead of common Error (Js Class)
 */
type ErrorObject = {
  message: string;
  errors?: string | string[];
  statusCode?: number;
};

type DomainExceptionInput = string | ErrorObject;

export class DomainException extends Error {
  public readonly message: string;
  public readonly errors?: string | string[];
  public readonly statusCode: number;

  constructor(input: DomainExceptionInput) {
    if (typeof input === 'string') {
      super(input);
      this.message = input;
      this.statusCode = 400;
    } else {
      const { message, errors, statusCode = 400 } = input;
      const formattedErrors = Array.isArray(errors) ? errors.join(', ') : (errors ?? message);
      super(formattedErrors);
      this.message = message;
      this.errors = errors;
      this.statusCode = statusCode;
    }

    this.name = 'DomainException';
  }
}
