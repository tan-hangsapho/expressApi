require("dotenv").config();
import AccountVerificationModel from "../database/models/account-verification.models";
import UserModel, { IUser, IUserDocument } from "../database/models/user.model";
import { AccountVerificationRepository } from "../database/repository/account-verification-repos";
import { UserRepository } from "../database/repository/user-Repository";
import { UserSchemaType } from "../schema/@types/userSchema.type";
import { generatePassword } from "../utils/jwt";
import { UserSignUpResult } from "./@types/serviceUser.type";
import nodemailer from "nodemailer";
export class AuthService {
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

      // Return Response
      return newUser;
    } catch (error: unknown) {
      throw error;
    }
  }
  async SendVerifyEmailToken({
    userId,
    token,
  }: {
    userId: string;
    token: string;
  }) {
    // TODO
    // 2. Save the Verify Token in the Database
    try {
      // Step 2
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken: token,
      });
      await accountVerification.save();
      const existedUser = await this.userRepo.FindUserById({ id: userId });
      if (!existedUser) {
        throw new Error("User does not exist!");
      }
    } catch (error) {
      throw error;
    }
  }
  async sendVerificationEmail(user: IUser, verificationToken: string) {
    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      // Construct email options
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.USER,
        to: user.email,
        subject: "Verify Your Email",
        html: `
          <p>Hello ${user.username},</p></br>
          <p>Please click the following link to verify your email:</p>
          <p><a href="http://localhost:3000/verify?token=${verificationToken}">Verify Email</a></p>
        `,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return info;
    } catch (error) {
      // Handle error
      console.error("Error sending email:", error);
      throw new Error("Failed to send verification email.");
    }
  }
}
