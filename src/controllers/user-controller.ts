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
import { UserService } from "../service/user-service";
import { StatusCode } from "../utils/consts";
import { generateSignature } from "../utils/jwt";
interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
}
@Route("user")
@Tags("Users")
export class UserController extends Controller {
  private userService: UserService;
  constructor() {
    super();
    this.userService = new UserService();
  }
  @SuccessResponse(StatusCode.Created, "Created")
  @Post("/signup")
  public async RegisterUser(
    @Body() requestBody: SignUpRequestBody
  ): Promise<IUser> {
    try {
      const { username, email, password } = requestBody;
      const newUser = await this.userService.SignUp({
        username,
        email,
        password,
      });
      await this.userService.SendVerifyEmailToken({ userId: newUser._id });
      return newUser;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get("/verify")
  public async VerifyEmail(@Query() token: string): Promise<{ token: string }> {
    try {
      // Verify the email token
      const user = await this.userService.EmailVerification({ token });

      // Generate JWT for the verified user
      const jwtToken = await generateSignature({
        userId: user._id,
      });

      return { token: jwtToken };
    } catch (error) {
      throw error;
    }
  }
}
