import bcrypt, { compareSync } from 'bcryptjs';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

class LoginService {
    async login_user(email: string, password: string) {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if the password is correct
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        if (user.active !== true) {
            throw new Error('User Has not Activated his account');
        }
        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY as string, { expiresIn: '1h' });

        return { token, user };
    }
}

export default new LoginService();
