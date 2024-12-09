import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export enum HttpStatuses {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,

  BAD_REQUEST_400 = 400,
  NOT_FOUND_404 = 404,
}

export enum ResultCodes {
  SUCCESS,

  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT,
}

export const resultCodeToHttpException = (
  code: ResultCodes,
  message?: string,
  field?: string,
) => {
  switch (code) {
    case ResultCodes.NOT_FOUND:
      throw new NotFoundException(message);
    case ResultCodes.CONFLICT:
      throw new ConflictException(message);
    case ResultCodes.BAD_REQUEST:
      throw new BadRequestException({ message: message, field: field });
  }
};
