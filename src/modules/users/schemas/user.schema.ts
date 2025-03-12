import { registerSchema } from '../../auth/schemas/auth.schema';

// No sensitive user data accepted
export const userProfileSchema = registerSchema.omit({ password: true }).partial();
