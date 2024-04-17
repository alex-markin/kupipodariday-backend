import { IsNumber, IsBoolean, IsOptional, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number; // id of the item

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden?: boolean;
}
