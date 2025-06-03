import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z
    .string({
      invalid_type_error: 'Name must be a string.',
      required_error: 'Name is required.',
    })
    .min(3, 'Name must be at least 3 characters long.'),
  email: z
    .string({ invalid_type_error: 'Email must be a string.', required_error: 'Email is required.' })
    .email('Invalid email address.'),
  password: z
    .string({
      invalid_type_error: 'Password must be a string.',
      required_error: 'Password is required.',
    })
    .min(6, 'Password must be at least 6 characters long.'),
});

export const SignUpUser = UserSchema.omit({ id: true });
export const SignInUser = UserSchema.omit({ id: true, name: true });
