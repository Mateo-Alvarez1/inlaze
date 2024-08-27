import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/JwtPayload';
import { JwtService } from '@nestjs/jwt';
import { log } from 'node:console';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { urlencoded } from 'express';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, ...restData } = createUserDto;
    try {
      const user = this.userRepository.create({
        ...restData,
        password: bcrypt.hashSync(password, 12),
      });

      await this.userRepository.save(user);

      return {
        user,
        token: this.createJwt({
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        }),
      };
    } catch (e) {
      this.handleErrors(e);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        id: true,
        fullname: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Check Credentials (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new NotFoundException('Check Credentials (password)');
    }

    return {
      user,
      token: this.createJwt({
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      }),
    };
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const user = await this.userRepository.preload({
      id: id,
      updatedAt: new Date(),
      ...updateAuthDto,
    });

    if (!user) {
      throw new BadRequestException(`User with id: ${id} not exists`);
    }
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  private createJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
  }
}
