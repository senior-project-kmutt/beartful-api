export class ErrorResponse {
  code: string;
  message: string;
  errorMessages?: Record<string, any>[];

  constructor(
    code: string,
    message: string,
    errorMessages?: Record<string, any>[]
  ) {
    this.code = code;
    this.message = message;
    this.errorMessages = errorMessages;
  }
}

export const ErrorCode = {
  InternalServerError: new ErrorResponse("E000", "Internal Server Error"),
  DuplicateUsername: (username: string) => {
    return new ErrorResponse("E001", `Username ${username} is already use`);
  },
  DuplicateEmail: new ErrorResponse("E001", "Duplicate email"),
  InvalidUser: new ErrorResponse("E002", "Invalid username and password"),
  Unauthorized: new ErrorResponse("E003", "Unauthorized!"),
  Forbidden: new ErrorResponse("E004", "Forbidden"),
  MissingRequiredField: (field: string) => {
    return new ErrorResponse("E004", `${field} is required`);
  }
};
