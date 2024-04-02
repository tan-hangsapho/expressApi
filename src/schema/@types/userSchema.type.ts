import { UserSignUpSchema } from "../user-schema";

export type UserSchemaType = ReturnType<typeof UserSignUpSchema.parse>;
