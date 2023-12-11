import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@Controller('gossip')
export class GossipController {
  @Post()
  async createGossip(req: Request, res: Response): Promise<Response> {
    return res.status(StatusCodes.CREATED).json({});
  }
}
