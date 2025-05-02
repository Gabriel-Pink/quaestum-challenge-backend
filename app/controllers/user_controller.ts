import User from '#models/user';
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http';

export default class UserController {

    index() {
        return [
            {
                id: 1,
                username: 'virk',
            },
            {
                id: 2,
                username: 'romain',
            },
        ]
    }

    async signUp({ request, response }: HttpContext) {
        const { email, password, fullName } = request.only(['email', 'password', 'fullName']);

        // Validate email and password format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        // Validate email format
        if (!emailRegex.test(email)) {
            return response.badRequest('Invalid email format');
        }
        // Validate password strength
        // if (!passwordRegex.test(password)) {
        //     return response.badRequest('Password must be at least 8 characters long and contain at least one letter and one number');
        // }

        // Check if the email is already in use
        const existingUser = await User.findBy('email', email);

        if (existingUser) {
            return response.badRequest('E-mail already in use');
        }

        const user = await User.create({
            email,
            password: await hash.make(password),
            fullName,
            role: 'manager',
        });

        return response.created({ user })
    }

    async signIn({ request, response, auth }: HttpContext) {
        const { email, password } = request.only(['email', 'password']);

        // Validate email and password format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Validate email format
        if (!emailRegex.test(email)) {
            return response.badRequest('Invalid email format');
        }

        const user = await User.findBy('email', email);

        if (!user) {
            return response.badRequest('Invalid credentials');
        }

        const passwordVerified = await hash.verify(user.password, password);

        if (!passwordVerified) {
            return response.badRequest('Invalid credentials');
        }

        const token = await auth.use('jwt').generate(user);

        return response.ok({ user, token })
    }

}