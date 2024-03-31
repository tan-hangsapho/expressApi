import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const salt = 10;
export const generatePassword = async (passowrd: string) => {
  try {
    return await bcrypt.hash(passowrd, salt);
  } catch (error) {
    throw new Error("Unable to generate password");
  }
};
export const validationPassword = async ({
  enterPassword,
  savedPassword,
}: {
  enterPassword: string;
  savedPassword: string;
}) => {
  return (await generatePassword(enterPassword)) === savedPassword;
};

export const generateSignature = async (payload: object): Promise<string> => {
  try {
    return await jwt.sign(payload, process.env.APP_SECRET as string, {
      expiresIn: "30d",
    });
  } catch (error) {
    throw new Error("Unable to generate signature from jwt");
  }
};
