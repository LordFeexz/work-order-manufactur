import 'dotenv/config';
import { decode, sign, verify, type JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from 'src/models/users';

export interface TokenPayload {
  id: string;
  role: USER_ROLE;
}

export type TokenValue<T = any> = TokenPayload & JwtPayload & T;

class Jwt {
  public generateToken(payload: TokenPayload) {
    return sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
  }

  public verifyToken<T = {}>(token: string): TokenValue<T> {
    return verify(token, process.env.JWT_SECRET) as TokenValue<T>;
  }

  public decodeToken(token: string) {
    return decode(token) as TokenValue;
  }
}

const jwt = new Jwt();

export { jwt };
