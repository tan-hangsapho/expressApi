import express, { NextFunction, Request, Response } from "express";
import { requestTime } from "./middlewars/requestTime";
import { movieRouter } from "./routes/movie_route";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../dist/swagger/swagger.json";
import errorHandler from "./middlewars/errorhandle";
function createServer() {
  const app = express();
  // Middleware
  app.use(express.json());
  app.use(requestTime);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // Routes
  app.use("/movie", movieRouter);
  // Catch-all route for handling unknown routes
  app.all("*", (req: Request, res: Response, _next: NextFunction) => {
    _next(new Error(`page could be not found!`));
  });
  app.use(errorHandler);
  return app;
}
export default createServer();
