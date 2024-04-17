import { PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
  Length,
  Min,
} from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  raised?: number;
}
