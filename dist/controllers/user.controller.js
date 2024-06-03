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
const user_service_1 = __importDefault(require("../services/user.service"));
const user_login_service_1 = __importDefault(require("../services/user.login.service"));
const user_verification_email_1 = __importDefault(require("../email/user-verification.email"));
const otp_service_helper_1 = __importDefault(require("../helper/otp-service.helper"));
class UserController {
    register_user(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_data = req.body;
            try {
                if (!user_data.first_name || !user_data.last_name || !user_data.email || !user_data.password || !user_data.confirm_password) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'All fields are required'
                    });
                }
                if (user_data.password !== user_data.confirm_password) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Passwords do not match'
                    });
                }
                if (user_data.password.length < 8) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Password must be at least 8 characters long'
                    });
                }
                const email_exists = yield user_service_1.default.find_user(user_data.email);
                if (email_exists) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Email already exists'
                    });
                }
                const user = yield user_service_1.default.register_user(user_data);
                const reset_url = `${req.protocol}://${req.get('host')}/api/v1/user/activate-account/${user.active_token}`;
                yield (0, user_verification_email_1.default)({
                    email: user.email,
                    subject: 'Email Verification',
                    message: `Please click on the link to verify your email:\n\n${reset_url}`
                    // content: `Thank You`
                });
                res.status(200).json({
                    status: 'success',
                    message: 'Check Your email to Activate your account'
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
    // login user
    login_user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'All fields are required'
                    });
                }
                const { token, user } = yield user_login_service_1.default.login_user(email, password);
                res.status(200).json({
                    status: 'success',
                    data: [
                        {
                            token,
                            first_name: user.first_name
                        }
                    ]
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
    get_all_users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_service_1.default.get_all_users();
            res.status(200).json({
                status: 'success',
                data: users
            });
        });
    }
    delete_users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted_users = yield user_service_1.default.delete_users();
            res.status(200).json({
                status: 'success',
                data: deleted_users
            });
        });
    }
    validate_token(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const user = yield user_service_1.default.validate_token(token);
                if (!user) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Invalid token'
                    });
                }
                user.active = true;
                user.active_token = '';
                yield user.save();
                res.status(200).json({
                    status: 'success',
                    message: 'Account Successfully Activated....'
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
    send_otp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield user_service_1.default.find_user(email);
                if (!user) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'User not found'
                    });
                }
                if (user.active === false) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Account not activated, Kindly activate your account to be able to proceed'
                    });
                }
                const otp = (0, otp_service_helper_1.default)();
                const five_mins = 1 * 60 * 1000;
                const now = new Date();
                user.otp_expire = new Date(now.getTime() + five_mins);
                user.otp = otp;
                console.log(user.otp);
                user.save();
                yield (0, user_verification_email_1.default)({
                    email: user.email,
                    subject: 'One Time Password',
                    message: `Kindly use the OTP provided for you below\n\n ${otp}\n\nPlease Note that it will expire in 5mins`
                });
                res.status(200).json({
                    status: 'success',
                    message: 'OTP sent to your email'
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
    validate_otp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                if (!otp) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'OTP is required'
                    });
                }
                const user = yield user_service_1.default.validate_otp(otp);
                if (!user) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Invalid OTP'
                    });
                }
                res.status(200).json({
                    status: 'success',
                    message: 'OTP Verified Successfully....'
                });
                user.otp = undefined;
                user.otp_expire = undefined;
                yield user.save();
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
    generate_api_key(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = res.locals;
                if (!user) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Email is required'
                    });
                }
                const user_email = yield user_service_1.default.find_user(user);
                if (!user_email) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'User not found'
                    });
                }
                const api_key = yield user_service_1.default.generate_api_key(user_email);
                console.log(api_key);
                res.status(200).json({
                    status: 'success',
                    data: api_key.api_key
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
    view_api_key(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Email is required'
                    });
                }
                const user = yield user_service_1.default.find_user(email);
                if (!user) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'User not found'
                    });
                }
                if (user.api_key === undefined) {
                    return res.status(200).json({
                        status: 'fail',
                        message: 'API Key not generated'
                    });
                }
                console.log(user);
                res.status(200).json({
                    status: 'success',
                    data: user.api_key
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
    delete_api_key(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Email is required'
                    });
                }
                const user = yield user_service_1.default.find_user(email);
                if (!user) {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'User not found'
                    });
                }
                user.api_key = undefined;
                yield user.save();
                res.status(200).json({
                    status: 'success',
                    message: 'API Key deleted successfully'
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }
        });
    }
}
exports.default = new UserController();
