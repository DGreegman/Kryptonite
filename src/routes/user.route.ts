import express, { Router } from 'express';
import user_controller from '../controllers/user.controller';

const user_route: Router = express.Router();
user_route.route('/register').post(user_controller.register_user);
user_route.route('/login').post(user_controller.login_user);
user_route.route('/delete').delete(user_controller.delete_users);
user_route.route('/validate-token/:token').patch(user_controller.validate_token);
user_route.route('/get-users').get(user_controller.get_all_users);
user_route.route('/send-otp').patch(user_controller.send_otp);
user_route.route('/validate-otp').patch(user_controller.validate_otp);

export default user_route;
