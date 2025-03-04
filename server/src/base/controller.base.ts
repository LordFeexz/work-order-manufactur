import type { Response } from 'express';
import { ERROR_NAME } from 'src/constants/global.constant';
import type {
  IRespBody,
  IRespBodyProps,
  PaginationRespProps,
} from 'src/interfaces/response.interface';
import { PassThrough } from 'stream';

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

  protected sendFile(
    res: Response,
    responseHeaders: [string, string][],
    data: any,
    encoding?: BufferEncoding,
  ) {
    const stream = new PassThrough();
    stream.end(data, encoding);

    if (responseHeaders.length)
      for (const [key, value] of responseHeaders) res.setHeader(key, value);

    stream.pipe(res);
  }
}
