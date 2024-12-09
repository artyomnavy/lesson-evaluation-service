import { ResultCodes } from './utils';

export type ErrorMessageType = {
  message: string;
  field: string;
};

export type ErrorsMessagesType = {
  errorsMessages: ErrorMessageType[];
};

export type ResultType<T> = {
  data: T;
  code: ResultCodes;
  message?: string;
  field?: string;
};
