import { UserSchema } from "../user-schema";

export type UserSchemaType = ReturnType<typeof UserSchema.parse>;
