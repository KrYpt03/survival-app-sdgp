import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from './errorHandler';

/**
 * Middleware to validate request data against a Zod schema
 * @param schema Zod schema to validate against
 * @param source Which part of request to validate ('body', 'query', 'params')
 */
export const validateRequest = (
  schema: AnyZodObject,
  source: 'body' | 'query' | 'params' | 'all' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (source === 'all') {
        // Validate multiple parts of the request
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } else {
        // Validate a specific part of the request
        const data = req[source];
        await schema.parseAsync(data);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ApiError(400, 'Validation failed', error.format()));
      } else {
        next(error);
      }
    }
  };
}; 