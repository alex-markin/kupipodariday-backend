// NestJS Core and exceptions
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

// DTOs
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities and services
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async createWishlist(createWishlistDto: CreateWishlistDto, user: User) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = await this.wishesService.getManyWishesById(itemsId);

    const wishlist = await this.wishlistRepository.save({
      items,
      owner: user,
      ...rest,
    });
    return wishlist;
  }

  async getAllWishlists() {
    return (
      this.wishlistRepository.find({
        relations: ['items', 'owner'],
      }) || []
    );
  }

  async getWishlistById(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ) {
    const wishlist = await this.getWishlistById(id);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException('You can not update this wishlist');
    }
    const { itemsId, name, image, description } = updateWishlistDto;
    const items = await this.wishesService.getManyWishesById(itemsId || []);

    await this.wishlistRepository.save({
      ...wishlist,
      name,
      image,
      description,
      items: items,
    });
    return await this.getWishlistById(id);
  }

  async removeWishlist(id: number, user: User) {
    const wishlist = await this.getWishlistById(id);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException('You can not delete this wishlist');
    }

    await this.wishlistRepository.delete(id);
    return true;
  }
}
