import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

export function validate<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
