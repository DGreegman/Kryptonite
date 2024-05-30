import { Document } from 'mongoose';

interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password?: string;
    otp?: number;
    otp_expire?: Date;
    active_token: string;
    active?: boolean;
}

export default IUser;
