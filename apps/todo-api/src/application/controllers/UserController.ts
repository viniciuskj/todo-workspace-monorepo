import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { DomainUserService } from '../../domain/services/DomainUserService';
import { Response } from 'express';
import { User } from '../../domain/entities/User';
import { v4 as uuid } from 'uuid';
import { UserRequest, UserResponse } from '@my-workspace/shared-dtos';
import { userRequestSchema } from '@my-workspace/shared-dtos';
import { Public } from '../../common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: DomainUserService) {}

  @Public()
  @Post()
  async createUser(
    @Body() userRequest: UserRequest,
    @Res() res: Response
  ): Promise<Response<UserResponse>> {
    const validatedUserRequest = userRequestSchema.parse(userRequest);

    const newUser = new User({
      identifier: uuid(),
      email: validatedUserRequest.email,
      name: validatedUserRequest.name,
      password: validatedUserRequest.password,
    });

    const createdUser = await this.userService.create(newUser);

    return res.status(HttpStatus.CREATED).json(createdUser);
  }

  @Get(':identifier')
  async getUser(
    @Param('identifier') identifier: string,
    @Res() res: Response
  ): Promise<Response<UserResponse>> {
    const user = await this.userService.readOne(identifier);

    const userResponse: UserResponse = {
      identifier: user.identifier,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(HttpStatus.OK).json(userResponse);
  }

  @Put(':identifier')
  async updateUser(
    @Param('identifier') identifier: string,
    @Body() userRequest: UserRequest,
    @Res() res: Response
  ): Promise<Response<UserResponse>> {
    const validatedUserRequest = userRequestSchema.parse(userRequest);

    const user = await this.userService.readOne(identifier);

    user.name = validatedUserRequest.name;
    user.email = validatedUserRequest.email;
    user.password = validatedUserRequest.password;

    await this.userService.update(user);

    const userResponse: UserResponse = {
      identifier: user.identifier,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(HttpStatus.OK).json(userResponse);
  }

  @Get()
  async getUsers(@Res() res: Response): Promise<Response<UserResponse[]>> {
    const users = await this.userService.readMany();

    const userResponse = users.map(
      (user) =>
        new User({
          identifier: user.identifier,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
    );

    return res.status(HttpStatus.OK).json(userResponse);
  }
}
