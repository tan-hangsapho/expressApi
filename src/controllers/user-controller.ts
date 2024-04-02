import {
  Body,
  Post,
  Query,
  Route,
  SuccessResponse,
  Get,
  Tags,
  Controller,
} from "tsoa";
import { IUser } from "../database/models/user.model";
import { StatusCode } from "../utils/consts";
import { AuthService } from "../service/user-service";
import { generateSignature } from "../utils/jwt";
import { generateEmailVerificationToken } from "../utils/account-verification";

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}
@Route("user")
@Tags("Users")
export class UserController extends Controller {
  private userService: AuthService;
  constructor() {
    super();
    this.userService = new AuthService();
  }
  @SuccessResponse(StatusCode.Created, "Created")
  @Post("/signup")
  public async RegisterUser(
    @Body() requestBody: SignUpRequestBody
  ): Promise<IUser> {
    try {
      const generateToken = generateEmailVerificationToken();
      const { username, email, password } = requestBody;
      const newUser = await this.userService.SignUp({
        username,
        email,
        password,
      });

      await this.userService.SendVerifyEmailToken({
        userId: newUser._id,
        token: generateToken,
      });
      await this.userService.sendVerificationEmail(newUser, generateToken);
      return newUser;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // @SuccessResponse(StatusCode.OK, "OK")
  // @Get("/verify")
  // public async VerifyEmail(@Query() token: string): Promise<{ token: string }> {
  //   try {
  //     // Verify the email token
  //     const user = await this.userService.VerifyEmailToken({ token });

  //     // Generate JWT for the verified user
  //     const jwtToken = await generateSignature({
  //       userId: user._id,
  //     });

  //     return { token: jwtToken };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
