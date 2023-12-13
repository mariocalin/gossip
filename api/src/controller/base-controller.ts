import { type Request } from 'express';
import { type Id } from '../model/id';
import { type AuthService } from '../service/auth-service';

export abstract class BaseController {
  constructor(private readonly authService: AuthService) {}

  protected async getCurrentUserOrFail(req: Request): Promise<Id> {
    const authorization = req.header('Authorization');

    if (authorization === undefined) {
      throw new Error('Header authorization is not present');
    }

    const plainUserId: string = authorization.replace('Bearer ', '');

    let userId: Id;

    try {
      userId = parseInt(plainUserId);
    } catch (err) {
      throw new Error('Header authorization is invalid');
    }

    const isAuthenticated = await this.authService.checkAuth(userId);

    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    return userId;
  }
}
