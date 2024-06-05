"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const config_1 = __importDefault(require("./config/config"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const user_image_route_1 = __importDefault(require("./routes/user-image.route"));
const error_handler_middleware_1 = __importDefault(require("./middlewares/error-handler.middleware"));
const custom_error_1 = __importDefault(require("./error/custom-error"));
(0, dotenv_1.configDotenv)();
(0, config_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use('/api/v1/user', user_route_1.default);
app.use('/api/v1/user-image', user_image_route_1.default);
// DEFAULT ROUTE CALLED WHEN A ROUTE USED BY THE USER DOESN'T EXIST
app.use('*', (req, res, next) => {
    const error = new custom_error_1.default(`Oops...., It seems like the Route ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});
app.use(error_handler_middleware_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
