"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const validate_token_middlleware_1 = __importDefault(require("../middlewares/validate-token.middlleware"));
const user_route = express_1.default.Router();
user_route.route('/register').post(user_controller_1.default.register_user);
user_route.route('/login').post(user_controller_1.default.login_user);
user_route.route('/delete').delete(user_controller_1.default.delete_users);
user_route.route('/validate-token/:token').patch(user_controller_1.default.validate_token);
user_route.route('/get-users').get(user_controller_1.default.get_all_users);
user_route.route('/send-otp').patch(user_controller_1.default.send_otp);
user_route.route('/validate-otp').patch(user_controller_1.default.validate_otp);
user_route.route('/generate-api-key').patch(user_controller_1.default.generate_api_key);
user_route.route('/view-api-key').get(validate_token_middlleware_1.default, user_controller_1.default.view_api_key);
user_route.route('/delete-api-key').delete(user_controller_1.default.delete_api_key);
exports.default = user_route;
