import { ZodError, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ErrorStateCode } from "../utils/errorState";
import InvalidInputError from "../error/invalid-input-error";

export const validate = (schema: z.AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return next(new InvalidInputError(error));
      }
      next(error);
    }
  };
};
