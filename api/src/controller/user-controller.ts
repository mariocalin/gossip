import { Controller, Post, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../service/user-service';
import { isString } from 'lodash';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async allUsers(req: Request, res: Response): Promise<Response> {
    const users = await this.userService.getAllUsers();
    return res.status(StatusCodes.OK).json(users);
  }

  @Post()
  async createUser(req: Request, res: Response): Promise<Response> {
    if (!isString(req.body.name)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ name: 'Missing name parameter or not a string' });
    }

    const name = req.body.name as string;

    const user = await this.userService.createUser(name);

    return res
      .status(StatusCodes.CREATED)
      .json({ ...user, creationDate: new Date() });
  }
}
