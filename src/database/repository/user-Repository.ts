import UserModel from "../models/user.model";
import { UserCreateRepository } from "./@types/user-Repository";

export class UserRepository {
  async createUser({ username, email, password }: UserCreateRepository) {
    try {
      const existingUser = await this.FindUser({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }
      const user = new UserModel({
        username,
        email,
        password,
      });
      const userResult = await user.save();
      return userResult;
    } catch (err) {
      throw err;
    }
  }
  async FindUser({ email }: { email: string }) {
    try {
      const existingUser = await UserModel.findOne({ email: email });
      return existingUser;
    } catch (err) {
      return null;
    }
  }
  async FindUserById({ id }: { id: string }) {
    try {
      const existingUser = await UserModel.findById(id);

      return existingUser;
    } catch (error) {
      throw new Error("Unable to Find User in Database");
    }
  }
}
