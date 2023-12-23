import { Controller, Post, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../service/user-service';
import { isString } from 'lodash';
import { isValidURL } from '../common/utils';

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
      return res.status(StatusCodes.BAD_REQUEST).json({ name: 'Missing name parameter or not a string' });
    }

    if (req.body.picture !== undefined && !isValidURL(req.body.picture)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ picture: 'Invalid picture format' });
    }

    const name = req.body.name as string;
    const picture = req.body.picture as string;

    const user = await this.userService.createUser(name, picture);

    return res.status(StatusCodes.CREATED).json({ ...user, creationDate: new Date() });
  }
}
