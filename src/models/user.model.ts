import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user.interface';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        confirm_password: {
            type: String
        },
        api_key: {
            type: String
        },
        otp: {
            type: Number
        },
        otp_expire: Date,
        active_token: {
            type: String
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
