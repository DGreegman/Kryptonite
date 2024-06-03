"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_image_controller_1 = __importDefault(require("../controllers/user-image.controller"));
const multer_1 = __importDefault(require("multer"));
const api_key_validation_middleware_1 = __importDefault(require("../middlewares/api-key-validation.middleware"));
const image_router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
image_router.patch('/image', api_key_validation_middleware_1.default, upload.single('image'), (req, res) => {
    user_image_controller_1.default.upload(req, res);
});
exports.default = image_router;
