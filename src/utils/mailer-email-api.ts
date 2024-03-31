import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import {
  EmailApi,
  EmailApiSendEmailArgs,
  EmailApiSendEmailResponse,
  EmailApiSendSignUpVerificationEmailArgs,
} from "./@types/email-sender.types";
import MailerSmtpServer from "./mailer-smtp-server";
import {
  BuildEmailVerificationLinkArgs,
  BuildSignUpVerificationEmailArgs,
} from "./@types/email-verification-types";

export class MailerEmailApi implements EmailApi {
  private transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport(
      new MailerSmtpServer().getConfig()
    );
  }
  async sendSignUpVerificationEmail(
    args: EmailApiSendSignUpVerificationEmailArgs
  ): Promise<EmailApiSendEmailResponse> {
    const { toEmail, emailVerificationToken } = args;

    const emailVerificationLink = this.buildEmailVerificationLink({
      emailVerificationToken,
    });

    const subject = "welcome to micro-sample! Please verify your email address";
    const textBody = this.buildSignUpVerificationEmailTextBody({
      emailVerificationLink,
    });
    const htmlBody = this.buildSignUpVerificationEmailHtmlBody({
      emailVerificationLink,
    });

    await this.sendEmail({ toEmail, subject, textBody, htmlBody });

    return {
      toEmail,
      status: "success",
    };
  }

  private buildEmailVerificationLink = (
    args: BuildEmailVerificationLinkArgs
  ): string => {
    const { emailVerificationToken } = args;

    // TODO: this url will change once we integrate kubernetes in our application
    return `http://localhost:3000/v1/auth/verify?token=${emailVerificationToken}`;
  };

  private buildSignUpVerificationEmailTextBody = (
    args: BuildSignUpVerificationEmailArgs
  ): string => {
    const { emailVerificationLink } = args;

    return `Welcome to Micro-sample, the coolest micro sample platform! Please click on the link below (or copy it to your browser) to verify your email address. ${emailVerificationLink}`;
  };

  private buildSignUpVerificationEmailHtmlBody = (
    args: BuildSignUpVerificationEmailArgs
  ): string => {
    const { emailVerificationLink } = args;

    return `
        <h1>Welcome to Micro-sample</h1>
        <br/>
        Welcome to Micro-sample, the coolest micro sample platform!
        <br/>
        <br/>
        Please click on the link below (or copy it to your browser) to verify your email address:
        <br/>
        <br/>
        <a href="${emailVerificationLink}">${emailVerificationLink}</a>`;
  };

  private async sendEmail(args: EmailApiSendEmailArgs): Promise<void> {
    const { toEmail, subject, htmlBody, textBody } = args;
    await this.transporter.sendMail({
      from: "Micro-sample <noreply@microsample.app>",
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });
  }
}
