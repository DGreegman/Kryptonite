"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginService {
    login_user(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            console.log(user);
            if (!user) {
                throw new Error('User not found');
            }
            // Check if the password is correct
            const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            // Checking a user's account is activated
            if (user.active !== true) {
                throw new Error('User Has not Activated his account');
            }
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
            return { token, user };
        });
    }
}
exports.default = new LoginService();
