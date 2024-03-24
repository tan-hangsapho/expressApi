import express, { Express, NextFunction, Request, Response } from "express";
import { requestTime } from "../middlewars/requestTime";
import { movieRouter } from "../routes/movie_route";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../swagger";
import errorHandler from "../middlewars/errorhandle";
function createServer() {
  const app = express();
  // Middleware
  app.use(express.json());
  app.use(requestTime);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // Routes
  const PATH = "/movie";
  app.use(PATH, movieRouter);
  // Catch-all route for handling unknown routes
  app.all("*", (req: Request, res: Response, _next: NextFunction) => {
    _next(new Error(`page could be not found!`));
  });
  app.use(errorHandler);
  return app;
}
export default createServer();
