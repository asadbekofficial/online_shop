import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.authRepository.create({ username, email, password: hashedPassword });
    await this.authRepository.save(newUser);
    const { password: _, ...result } = newUser;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) return { message: 'User not found' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { message: 'Invalid password' };

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}