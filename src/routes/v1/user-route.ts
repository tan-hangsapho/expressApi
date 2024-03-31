// import express, { Request, Response, NextFunction } from "express";
// import { UserSignUpSchema } from "../../schema/user-schema";
// import { UserController } from "../../controllers/user-controller";
// import { StatusCode } from "../../utils/consts";
// import { validate } from "../../middlewars/validation";
// export const userRouter = express.Router();

// userRouter.post(
//   "/signup",
//   validate(UserSignUpSchema),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const controllers = new UserController();
//       const requestBody = req.body;
//       const response = await controllers.RegisterUser(requestBody);
//       return res
//         .status(StatusCode.Created)
//         .send({ message: "Create Success", data: response });
//     } catch (error) {
//       next(error);
//     }
//   }
// );
// userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const controllers = new UserController();
//     const requestBody = req.body;
//     const response = await controllers.VerifyEmail(requestBody);
//     return res.status(StatusCode.Found).json(response);
//   } catch (error) {
//     next(error);
//   }
// });
