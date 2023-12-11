import { type Request } from 'express';
import { type Id } from '../model/id';

export abstract class BaseController {
  protected getCurrentUserOrFail(req: Request): Id {
    const userId = req.header('Authorization');

    if (userId === null || userId === undefined) {
      throw new Error('User is not authenticated');
    }

    return Number.parseInt(userId);
  }
}
