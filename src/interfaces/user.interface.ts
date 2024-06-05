import { Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    confirm_password?: string;
    api_key?: string;
    otp?: number;
    otp_expire?: Date;
    active_token: string;
    active?: boolean;
}

export default IUser;
