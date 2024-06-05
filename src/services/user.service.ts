import User from '../models/user.model';
import IUser from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import generate_otp from '../helper/otp-service.helper';

class CreateUserService {
    async register_user(data: IUser) {
        const { username, email, password, active_token, otp } = data;
        const initial_otp = generate_otp()
        const hash_password = bcrypt.hashSync(password, 10);
        const activate_token = crypto.randomBytes(32).toString('hex');
        const token = crypto.createHash('sha256').update(activate_token).digest('hex');

        return await User.create({ username, email, password: hash_password, active_token: token, otp:initial_otp });
    }

    async find_user_by_id(id: string) {
        return await User.findById(id);
    }
    async find_user(email: string)  {
        const user: string | any = await User.findOne({ email });    
        return user;
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

    async generate_api_key(email: string) {
        const api_key = crypto.randomBytes(32).toString('hex');
        return await User.findOneAndUpdate(
            { email },
            {
                $set: { api_key }
            },
            { new: true }
        ).then((response: IUser | any) => {
            console.log('GENERATED', api_key);
            return response;
        })
    }
}

export default new CreateUserService();
