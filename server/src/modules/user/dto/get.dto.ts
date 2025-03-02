import { IsString, IsUUID } from 'class-validator';

export class GetUserDto {
  @IsString()
  @IsUUID('4')
  public id: string;

  @IsString()
  public username: string;
}
