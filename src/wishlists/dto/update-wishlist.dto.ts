import { CreateWishlistDto } from './create-wishlist.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {}
