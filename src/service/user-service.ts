import AccountVerificationModel from "../database/models/account-verification.models";
import { AccountVerificationRepository } from "../database/repository/account-verification-repos";
import { UserRepository } from "../database/repository/user-Repository";
import DuplicateError from "../error/duplicate-error";
import { UserSchemaType } from "../schema/@types/userSchema.type";
import { generateEmailVerificationToken } from "../utils/account-verification";
import { StatusCode } from "../utils/consts/statusCode";
import EmailSender from "../utils/email-sender";
import { generatePassword } from "../utils/jwt";
import { UserSignUpResult } from "./@types/serviceUser.type";
export class UserService {
  private userRepo: UserRepository;
  private accountVerificationRepo: AccountVerificationRepository;
  constructor() {
    this.userRepo = new UserRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }
  async SignUp(userDetails: UserSchemaType): Promise<UserSignUpResult> {
    try {
      const { username, email, password } = userDetails;
      // Convert User Password to Hash Password
      const hashedPassword = await generatePassword(password);
      // Save User to Database
      const newUser = await this.userRepo.createUser({
        username,
        email,
        password: hashedPassword,
      });
      return newUser;
    } catch (error: unknown) {
      if (error instanceof DuplicateError) {
        const existedUser = await this.userRepo.FindUser({
          email: userDetails.email,
        });

        if (!existedUser?.isVerfied) {
          // Resent the token
          await this.SendVerifyEmailToken({ userId: existedUser?._id });
        }

        // Throw or handle the error based on your application's needs
        throw new Error(
          "A user with this email already exists. Verification email resent."
        );
      }
      throw error;
    }
  }
  async SendVerifyEmailToken({ userId }: { userId: string }) {
    // TODO
    // 1. Generate Verify Token
    // 2. Save the Verify Token in the Database
    // 3. Get the Info User By Id
    // 4. Send the Email to the User
    try {
      const emailVerificationToken = generateEmailVerificationToken();
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
      });
      const newAccountVerification = await accountVerification.save();
      const existedUser = await this.userRepo.FindUserById({ id: userId });
      if (!existedUser) {
        throw new Error("User does not exist!");
      }
      const emailSender = EmailSender.getInstance();
      emailSender.sendSignUpVerificationEmail({
        toEmail: existedUser.email,
        emailVerificationToken: newAccountVerification.emailVerificationToken,
      });
    } catch (error) {
      throw error;
    }
  }
  async EmailVerification({ token }: { token: string }) {
    const isTokenExist =
      await this.accountVerificationRepo.FindAccountVerificationToken({
        token,
      });
    if (!isTokenExist) {
      throw new Error("Verification token is invalid");
    }
    // Find the user associated with this token
    const user = await this.userRepo.FindUserById({
      id: isTokenExist.userId.toString(),
    });
    if (!user) {
      throw new Error("User does not exist.");
    }
    // Mark the user's email as verified

    user.isVerfied = true;
    await user.save();

    // Remove the verification token
    await this.accountVerificationRepo.DeleteVerificationToken({ token });

    return user;
  }
}
