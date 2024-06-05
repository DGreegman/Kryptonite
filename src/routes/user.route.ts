import express, { Router } from 'express';
import user_controller from '../controllers/user.controller';
import validate_token from '../middlewares/validate-token.middlleware';

const user_route: Router = express.Router();

user_route.route('/register').post(user_controller.register_user);
user_route.route('/login').post(user_controller.login_user);
// user_route.route('/delete').delete(user_controller.delete_users);
user_route.route('/activate-account/:token').patch(user_controller.validate_token);
// user_route.route('/get-users').get(user_controller.get_all_users);
user_route.route('/send-otp').patch(user_controller.login_otp);
user_route.route('/validate-otp').patch(user_controller.validate_otp);
user_route.route('/generate-api-key').patch(validate_token, user_controller.generate_api_key);
user_route.route('/view-api-key').get(validate_token, user_controller.view_api_key);
user_route.route('/delete-api-key').delete(validate_token, user_controller.delete_api_key);

export default user_route;
