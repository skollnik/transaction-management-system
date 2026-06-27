// Catch-all for unmatched routes.

import type { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/AppError.js';

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}
