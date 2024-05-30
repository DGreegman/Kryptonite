import User from '../models/user.model';
import IUser from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

class CreateUserService {
    async register_user(data: IUser) {
        const { first_name, last_name, email, password, active_token } = data;
        const hash_password = bcrypt.hashSync(password, 10);
        const activate_token = crypto.randomBytes(32).toString('hex');
        const token = crypto.createHash('sha256').update(activate_token).digest('hex');

        return await User.create({ first_name, last_name, email, password: hash_password, active_token: token });
    }

    async find_user_by_id(id: string) {
        return await User.findById(id);
    }
    async find_user(email: string) {
        return await User.findOne({ email });
    }

    async get_all_users() {
        return await User.find();
    }
    async delete_users() {
        return await User.deleteMany();
    }

    async validate_token(token: string) {
        return await User.findOne({ active_token: token });
    }

    async validate_otp(otp: string) {
        return await User.findOne({ otp, otp_expire: { $gt: new Date() } });
    }
}

export default new CreateUserService();
