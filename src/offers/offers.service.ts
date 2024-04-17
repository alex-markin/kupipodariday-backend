// NestJS Core and exceptions
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

// DTO
import { CreateOfferDto } from './dto/create-offer.dto';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

// Entities
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

// Wishes service
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findWishById(createOfferDto.itemId);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException('You can not offer your own wish');
    }

    const amountRaised = wish.raised + createOfferDto.amount;
    if (amountRaised > wish.price) {
      throw new BadRequestException('Amount raised exceeds the price');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const offer = await queryRunner.manager.save(Offer, {
        ...createOfferDto,
        user,
        item: wish,
      });

      await queryRunner.manager.update(Wish, wish.id, {
        raised: amountRaised,
      });

      await queryRunner.commitTransaction();
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOffers() {
    return (
      (await this.offerRepository.find({ relations: ['user', 'item'] })) || []
    );
  }

  async findOfferById(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
  }
}
