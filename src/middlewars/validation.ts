import { ZodError, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ErrorStateCode } from "../utils/errorState";

export const validate =
  (schema: z.AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        const statusCode = new ErrorStateCode(errorMessages, 400);
        console.error("Validation Error:", error.errors);
        next(statusCode);
      } else {
        // If it's another type of error, handle it accordingly
        console.error("Unknown Error:", error); // Log the unknown error
        next(error);
      }
    }
  };
