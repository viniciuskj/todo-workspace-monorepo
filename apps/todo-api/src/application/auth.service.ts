import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DomainUserService } from '../domain/services/DomainUserService';
import { LoginRequest, LoginResponse } from '@my-workspace/shared-dtos';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth/model/JwtPayload';

const expiresIn = '10s';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: DomainUserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(loginRequest: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersService.searchUserByEmail(loginRequest.email);

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: user.identifier,
      identifier: user.identifier,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn,
      }),
    };
  }
}
