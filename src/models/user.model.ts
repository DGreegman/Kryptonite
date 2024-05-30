import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user.interface';
import crypto from 'crypto';
const UserSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
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

UserSchema.methods.activate_account = function () {
    const activate_token = crypto.randomBytes(32).toString('hex');
    this.active_token = crypto.createHash('sha256').update(activate_token).digest('hex');
    console.log(`Your activate token is ${activate_token}`);
    console.log(`Your saved active token is ${this.active_token}`);
    return activate_token;
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
