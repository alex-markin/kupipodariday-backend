import {
  IsString,
  IsUrl,
  Length,
  IsArray,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @Length(1, 1500)
  @IsOptional()
  description?: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsInt({ each: true })
  itemsId: number[];
}
