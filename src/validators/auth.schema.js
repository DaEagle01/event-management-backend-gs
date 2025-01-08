const { z } = require('zod');

const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .regex(
                /^(?=.*[a-zA-Z])(?=.*\d)/,
                'Password must contain at least one letter and one number'
            ),
        name: z.string().min(2, 'Name must be at least 2 characters'),
        profilePicUrl: z.string().url().optional()
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required')
    })
});

module.exports = {
    registerSchema,
    loginSchema
};