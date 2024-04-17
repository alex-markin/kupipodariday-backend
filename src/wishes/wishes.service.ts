// NestJS Core and exceptions
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

// DTOs
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

// Entities
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

// Constants
import { wishesLimit } from './wishes.consts';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private dataSource: DataSource,
  ) {}

  async createWish(createWishDto: CreateWishDto, owner: User) {
    return this.wishRepository.save({ ...createWishDto, owner: owner });
  }

  async findLastWishes() {
    try {
      const lastWishes = await this.wishRepository.find({
        order: { createdAt: 'desc' },
        take: wishesLimit.last,
        relations: ['owner'],
      });
      return lastWishes ? lastWishes : [];
    } catch (error) {
      throw new NotFoundException('Failed to fetch last wishes');
    }
  }

  async findPopWishes() {
    try {
      const popWishes = await this.wishRepository.find({
        order: { copied: 'desc' },
        take: wishesLimit.pop,
        relations: ['owner', 'offers', 'offers.user'],
      });
      return popWishes ? popWishes : [];
    } catch (error) {
      throw new NotFoundException('Failed to fetch top wishes');
    }
  }

  // ДЛЯ РЕВЬЮЕРА - тут есть ошибка фронта, поэтому сейчас не подтягивается имя поддержавшего.
  // фронт сейчас ищет name из offers, но там нет name, есть user.username
  // нужно либо вносить изменения во фронт или делать backend не по ТЗ
  // {wishData?.offers?.length ? (
  //   wishData?.offers?.map(({ name, amount, createdAt }) => (
  //     <UserSupportedCard name={name} amount={amount} date={createdAt} />
  //   ))
  // )
  async findWishById(id: number) {
    try {
      const wish = await this.wishRepository.findOne({
        where: { id },
        relations: ['owner', 'offers', 'offers.user'],
      });
      return wish ? wish : null;
    } catch (error) {
      throw new NotFoundException('Wish is not found by Id');
    }
  }

  async getManyWishesById(ids: number[]) {
    return (
      (await this.wishRepository.find({
        where: { id: In(ids) },
      })) || []
    );
  }

  async updateWish(
    wishId: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Wish is not found by Id');
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException(
        'You can not change the wish of another user',
      );
    }

    if (wish.raised > 0 && updateWishDto.price) {
      throw new BadRequestException(
        'You can not change wish which have already been funded',
      );
    }

    await this.wishRepository.update(wishId, updateWishDto);
    return await this.wishRepository.findOneBy({ id: wishId });
  }

  async deleteWish(wishId: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Wish is not found by Id');
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException(
        'You can not delete the wish of another user',
      );
    }

    await this.wishRepository.delete(wishId);
    return true;
  }

  async copyWish(wishId: number, user: User) {
    const originalWish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!originalWish) {
      throw new NotFoundException('Wish is not found by Id');
    }

    if (originalWish.owner && originalWish.owner.id === user.id) {
      throw new BadRequestException(
        'You can not copy your own wish or the wish does not have an owner',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        id,
        createdAt,
        updatedAt,
        raised,
        offers,
        copied,
        owner,
        ...wish
      } = await this.wishRepository.findOneBy({ id: wishId });
      await this.wishRepository.update(wishId, { copied: copied + 1 });

      const wishCopy = await this.createWish(wish, user);

      await queryRunner.commitTransaction();
      return wishCopy;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
