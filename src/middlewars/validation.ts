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
      const statusCode = new ErrorStateCode(error, 400);

      if (error instanceof ZodError) {
        if (error instanceof z.ZodError) {
          const formattedErrors = error.issues.reduce(
            (acc: { [key: string | number]: string }, issue) => {
              acc[issue.path[0]] = issue.message;
              return acc;
            },
            {}
          );
          return res.status(400).json({ error: formattedErrors });
        } else {
          console.error("Unexpected error:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    }
  };
