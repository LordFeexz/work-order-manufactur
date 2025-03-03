import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';

@Injectable()
export class DefaultPipe<T = any> implements PipeTransform<T, T> {
  public transform(value: T, _: ArgumentMetadata) {
    return value || this.defaultValue;
  }

  constructor(private readonly defaultValue: T) {}
}
