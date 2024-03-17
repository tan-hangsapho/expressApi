import { Request, Response, NextFunction } from "express";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default to 500 if no status code is set
  const statusCode = res.statusCode || 500;

  //res to client
  res.json({
    statusCode: statusCode,
    message: err.message,
  });
  next();
}
export default errorHandler;
