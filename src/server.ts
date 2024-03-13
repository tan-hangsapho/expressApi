import express, { Application, Request, Response } from "express";
import { studentRouter } from "./routes/student_route";
import { userRouter } from "./routes/user_route";
import path from "path";
import connectToDatabase from "./utils/dbConnection";
import { movieRouter } from "./routes/movie_route";
import bodyParser from "body-parser";
const app: Application = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express and TypeScript!");
});

// app.get("/student", (req: Request, res: Response) => {
//   res.send("Hello from student!");
// });

app.use("/student", studentRouter);
app.use("/user", userRouter);
app.use("/movie", movieRouter);
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

// app.listen(port, (): void => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
