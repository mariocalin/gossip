import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GossipService } from '../service/gossip-service';
import { BaseController } from './base-controller';
import { AuthService } from '../service/auth-service';
import { isString } from 'lodash';

@Controller('gossip')
export class GossipController extends BaseController {
  constructor(
    private readonly gossipService: GossipService,
    authService: AuthService
  ) {
    super(authService);
  }

  @Get()
  async getAllGossips(req: Request, res: Response): Promise<Response> {
    await this.getCurrentUserOrFail(req);
    const gossips = await this.gossipService.getAllGossips();
    return res.status(StatusCodes.OK).json(gossips);
  }

  @Post()
  async createGossip(req: Request, res: Response): Promise<Response> {
    const userId = await this.getCurrentUserOrFail(req);

    if (!isString(req.body.content)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ content: 'Missing content parameter or not a string' });
    }

    const content = req.body.content as string;

    const gossip = await this.gossipService.createGossip(userId, content);

    return res.status(StatusCodes.CREATED).json(gossip);
  }
}
