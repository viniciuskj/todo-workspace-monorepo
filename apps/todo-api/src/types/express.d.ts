import { JwtPayload } from '../application/auth/model/JwtPayload';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
