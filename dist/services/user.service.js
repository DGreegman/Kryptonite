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
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const otp_service_helper_1 = __importDefault(require("../helper/otp-service.helper"));
class CreateUserService {
    register_user(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, active_token, otp } = data;
            const initial_otp = (0, otp_service_helper_1.default)();
            const hash_password = bcryptjs_1.default.hashSync(password, 10);
            const activate_token = crypto_1.default.randomBytes(32).toString('hex');
            const token = crypto_1.default.createHash('sha256').update(activate_token).digest('hex');
            return yield user_model_1.default.create({ username, email, password: hash_password, active_token: token, otp: initial_otp });
        });
    }
    find_user_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(id);
        });
    }
    find_user(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            return user;
        });
    }
    get_all_users() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.find();
        });
    }
    delete_users() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.deleteMany();
        });
    }
    validate_token(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOne({ active_token: token });
        });
    }
    validate_otp(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOne({ otp, otp_expire: { $gt: new Date() } });
        });
    }
    generate_api_key(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const api_key = crypto_1.default.randomBytes(32).toString('hex');
            return yield user_model_1.default.findOneAndUpdate({ email }, {
                $set: { api_key }
            }, { new: true }).then((response) => {
                console.log('GENERATED', api_key);
                return response;
            });
        });
    }
}
exports.default = new CreateUserService();
