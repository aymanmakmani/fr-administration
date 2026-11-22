import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(id: number, password: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return undefined;
  }

  async login(user: any) {
    const payload = { username: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}