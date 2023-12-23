import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GossipService } from '../service/gossip-service';
import { BaseController } from './base-controller';
import { AuthService } from '../service/auth-service';
import { isString } from 'lodash';
import { type ParamsDictionary } from 'express-serve-static-core';
import { type Trust } from '../model/gossip';
import { isNumeric } from '../common/utils';

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

    const result = await this.gossipService.createGossip(userId, content);

    return result.fold(
      (error) => {
        return res.status(StatusCodes.BAD_REQUEST).json({ error });
      },
      (gossip) => {
        return res.status(StatusCodes.CREATED).json(gossip);
      }
    );
  }

  @Post(':gossipId/:trust')
  async positiveGossip(req: Request, res: Response): Promise<Response> {
    const userId = await this.getCurrentUserOrFail(req);

    if (!isNumeric(req.params.gossipId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ id: 'Bad id parameter' });
    }

    const trust = this.getTrustFromRequest(req.params);
    if (trust === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ trust: 'Bad trust parameter' });
    }

    const gossipId = parseInt(req.params.gossipId);

    const result = await this.gossipService.trustGossip(trust, userId, gossipId);

    return result.fold(
      (error) => {
        return res.status(StatusCodes.BAD_REQUEST).json({ error });
      },
      (trusts) => {
        return res.status(StatusCodes.OK).json(trusts);
      }
    );
  }

  private getTrustFromRequest(params: ParamsDictionary): Trust | undefined {
    const value = params.trust;

    if (value === 'positive') {
      return 'positive';
    } else if (value === 'negative') {
      return 'negative';
    }

    return undefined;
  }
}
