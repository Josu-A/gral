import { z } from "zod";

export const UserSchema = z.object({
});

export type IUser = z.infer<typeof UserSchema>;
