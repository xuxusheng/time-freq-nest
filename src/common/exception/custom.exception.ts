import { HttpStatus } from '@nestjs/common';

export class CustomException {
  private errDebug = '';
  private errDetail: string[] = [];

  constructor(
    private errCode: number,
    private errMsg: string,
    public _statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {}

  get statusCode() {
    return this._statusCode;
  }

  withMsg(msg: string) {
    this.errMsg = msg;
    return this;
  }

  withDetail(detail: string[]) {
    this.errDetail = detail;
    return this;
  }

  withDebug(debug: string) {
    this.errDebug = debug;
    return this;
  }

  toResponse(data = {}) {
    return {
      errCode: this.errCode,
      errMsg: this.errMsg,
      errDetail: this.errDetail,
      errDebug: this.errDebug,
      data,
    };
  }
}

export enum ErrCodes {
  BadRequest = 10000400,
  Unauthorized = 10000401,
  Forbidden = 10000403,
  NotFound = 10000404,
  TooManyRequest = 10000429,
  InternalServerError = 10000500,
  ServiceUnavailable = 10000503,

  // token 相关错误
  TokenEmpty = 2000_0001,
  TokenExpired = 2000_0002,
  TokenInvalid = 2000_0003,
}

export class BadRequestException extends CustomException {
  constructor(errMsg = '输入参数错误，请检查') {
    super(ErrCodes.BadRequest, errMsg, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends CustomException {
  constructor(errMsg = '身份验证失败') {
    super(ErrCodes.Unauthorized, errMsg, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends CustomException {
  constructor(errMsg = '禁止访问') {
    super(ErrCodes.Forbidden, errMsg, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends CustomException {
  constructor(errMsg = '资源不存在') {
    super(ErrCodes.NotFound, errMsg, HttpStatus.NOT_FOUND);
  }
}

export class TooManyRequestException extends CustomException {
  constructor(errMsg = '请求过多') {
    super(ErrCodes.TooManyRequest, errMsg, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class InternalServerErrorException extends CustomException {
  constructor(errMsg = '服务器内部错误') {
    super(
      ErrCodes.InternalServerError,
      errMsg,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ServiceUnavailableException extends CustomException {
  constructor(errMsg = '服务暂时不可用') {
    super(ErrCodes.ServiceUnavailable, errMsg, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
