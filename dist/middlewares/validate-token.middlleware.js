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
const custom_error_1 = __importDefault(require("../error/custom-error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("../services/user.service"));
const validate_token = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const test_token = req.headers.authorization || req.headers.Authorization;
    let token;
    try {
        if (typeof test_token === 'string' && test_token.startsWith('Bearer')) {
            token = test_token.split(' ')[1];
        }
        if (!token) {
            return next(new custom_error_1.default('Sorry, but it seems like you are not Logged in, Kindly login and try again', 401));
        }
        const secret_key = process.env.SECRET_KEY;
        if (!secret_key) {
            return next(new custom_error_1.default('Internal Server Error, Secret Key not set.', 500));
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret_key);
        console.log(decoded.email, `coming from middleware`);
        const user = yield user_service_1.default.find_user(decoded.email);
        // console.log(user);
        if (!user) {
            return next(new custom_error_1.default('Sorry, but it seems like the user with this token does not exist', 401));
        }
        res.locals = user.email;
        res.locals.id = user.id;
        // console.log(res.locals);
        next();
    }
    catch (error) {
        console.log(error.message, error.name);
        if (error.name === 'TokenExpiredError') {
            return next(new custom_error_1.default('Sorry, but your token has expired, Kindly login and try again', 403));
        }
        next(new custom_error_1.default('Invalid Token', 401));
    }
});
exports.default = validate_token;
