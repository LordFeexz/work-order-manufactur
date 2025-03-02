import type { IUserAttributes } from 'src/models/users';

export declare global {
  namespace Express {
    interface Request {
      user?: IUserAttributes;
    }
  }
}
