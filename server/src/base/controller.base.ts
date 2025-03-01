import { ERROR_NAME } from 'src/constants/global.constant';
import type {
  IRespBody,
  IRespBodyProps,
  PaginationRespProps,
} from 'src/interfaces/response.interface';

export abstract class BaseController {
  protected sendResponseBody = (
    { message, data = null, code, errors = null }: IRespBodyProps,
    opts?: PaginationRespProps,
  ): IRespBody => ({
    code,
    message,
    errors,
    status: ERROR_NAME[code],
    data,
    ...opts,
  });
}
