import { Length, IsEmail, IsUrl, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  @IsString()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
