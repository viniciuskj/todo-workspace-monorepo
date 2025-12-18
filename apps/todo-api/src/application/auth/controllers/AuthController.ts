import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import {
  LoginRequest,
  loginRequestSchema,
  LoginResponse,
} from '@my-workspace/shared-dtos';
import { Response } from 'express';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(
    @Body() loginRequest: LoginRequest,
    @Res() res: Response
  ): Promise<Response<LoginResponse>> {
    const validatedLoginRequest = loginRequestSchema.parse(loginRequest);

    const access_token = await this.authService.signIn(validatedLoginRequest);

    return res.status(HttpStatus.OK).json(access_token);
  }
}
