import { ResponseStatus } from 'src/common/enums/response.enums';

export class ErrorResponseDto {
  status: ResponseStatus;
  message: string;
  code: number;
  errorName: string;
  errors?: string | string[] | undefined;

  constructor(
    status: ResponseStatus,
    message: string,
    code: number,
    errorName: string,
    errors?: string | string[],
  ) {
    this.status = status;
    this.message = message;
    this.code = code;
    this.errorName = errorName;
    this.errors = errors;
  }
}
