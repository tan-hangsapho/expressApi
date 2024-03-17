import express, { Express, NextFunction, Request, Response } from "express";
import connectToDatabase from "./utils/dbConnection";
import { swaggerDocument } from "./swagger";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./middlewars/errorhandle";
import { requestTime } from "./middlewars/requestTime";
import { movieRouter } from "./routes/movie_route";

export const app: Express = express();
const port = 3000;

//Middleware

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

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
