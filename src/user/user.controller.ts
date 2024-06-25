import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { generateJwtToken } from 'src/utils/jwt';
import { Response } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import { Public } from 'src/auth/decorators/public';
import { LoginUserDto } from './dto/login-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles';
import { UserRole } from 'src/utils/enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  async create(@Body() createUserInput: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.findOne({
        email: createUserInput.email,
      });

      if (user) {
        throw new Error('User already exist with this email');
      }

      const hashPassword = await hash(
        createUserInput.password,
        await genSalt(),
      );

      const createUser = await this.userService.create({
        name: createUserInput.name,
        email: createUserInput.email,
        password: hashPassword,
        role: createUserInput.role,
      });

      const jwtToken = await generateJwtToken({
        id: createUser.id,
        email: createUser.email,
      });

      res.cookie('access_token', jwtToken.token, {
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        domain: 'localhost',
      });

      console.log('access Token', jwtToken.token);

      res.send({
        message: 'User created successfully',
        data: createUser,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('/login')
  async login(@Body() loginUserInput: LoginUserDto, @Res() res: Response) {
    try {
      const { email, password } = loginUserInput;

      const user = await this.userService.findOne({ email });

      if (!user) {
        throw new Error('User does not exist');
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const jwtToken = await generateJwtToken({
        id: user.id,
        email: user.email,
      });

      res.cookie('access_token', jwtToken.token, {
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        domain: 'localhost',
      });

      console.log('access Token', jwtToken.token);

      res.send({
        message: 'User logged in successfully',
        data: user,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/me')
  @Roles(UserRole.CANDIDATE, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  async getMyProfile(@CurrentUser() currentUser: User) {
    try {
      const user = await this.userService.findOne({ id: currentUser.id });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('update')
  @Roles(UserRole.CANDIDATE, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  async updateProfile(
    @CurrentUser() currentUser: User,
    @Body()
    updateUserInput: {
      name: string;
      email: string;
    },
  ) {
    try {
      const user = await this.userService.findOne({ id: currentUser.id });

      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await this.userService.update(
        { id: currentUser.id },
        updateUserInput,
      );

      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('delete')
  @Roles(UserRole.CANDIDATE, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  async deleteProfile(@CurrentUser() currentUser: User) {
    try {
      const user = await this.userService.findOne({ id: currentUser.id });

      if (!user) {
        throw new Error('User not found');
      }

      const deletedUser = await this.userService.delete({ id: currentUser.id });

      return deletedUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
