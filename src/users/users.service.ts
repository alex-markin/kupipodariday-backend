// NestJS Core and exceptions
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UseInterceptors,
} from '@nestjs/common';

// TypeORM
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// DTO and entities
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

// Services
import { HashService } from 'src/utils/hash/hash.service';

// Interceptors
import { PasswordInterceptor } from 'src/utils/interceptors/password.interceptor';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('User with this email already exists.');
      }
      if (existingUser.username === username) {
        throw new ConflictException('User with this username already exists.');
      }
    }

    const hash = await this.hashService.getHash(password);
    const user = await this.usersRepository.save({
      ...createUserDto,
      password: hash,
    });
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, username, email } = updateUserDto;

    const existingUser = await this.usersRepository.findOneBy({ id });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Checking username
    if (username && username !== existingUser.username) {
      const usernameExists = await this.usersRepository.findOne({
        where: [{ username }],
      });
      if (usernameExists) {
        throw new ConflictException(
          'User with this username already ready exists. Please try another.',
        );
      }
    }

    // Checking email
    if (email && email !== existingUser.email) {
      const emailExists = await this.usersRepository.findOne({
        where: [{ email }],
      });
      if (emailExists) {
        throw new ConflictException(
          'User with this email already exists. Please try another.',
        );
      }
    }

    // Hashing password
    if (password) {
      updateUserDto.password = await this.hashService.getHash(password);
    }
    await this.usersRepository.update(id, updateUserDto);
    return await this.findById(id);
  }

  async findUsers(query: FindUserDto) {
    const users = await this.usersRepository.find({
      where: [
        { username: Like(`%${query.query}%`) },
        { email: Like(`%${query.query}%`) },
      ],
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(query: string) {
    const user = await this.usersRepository.findOne({
      where: { username: query },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseInterceptors(PasswordInterceptor)
  async findWishesById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.wishes || [];
  }

  @UseInterceptors(PasswordInterceptor)
  async findWishesByName(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: [
        'wishes',
        'wishes.offers',
        'wishes.offers.item',
        'wishes.offers.user',
        'wishes.offers.item.owner',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.wishes || [];
  }
}
