const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
    async register(userData) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        const hashedPassword = await hashPassword(userData.password);

        const user = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                name: true,
                profilePicUrl: true
            }
        });

        const token = generateToken(user.id);

        return { user, token };
    }

    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profilePicUrl: user.profilePicUrl
            },
            token
        };
    }
}

module.exports = new AuthService();