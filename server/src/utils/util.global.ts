import { hash, compare } from 'bcryptjs';

class GlobalUtils {
  public hashData = async (data: string) => hash(data, 10);

  public compareHash = async (data: string, hash: string) =>
    compare(data, hash);
}

const globalUtils = new GlobalUtils();

export { globalUtils };
