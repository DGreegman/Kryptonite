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
const user_image_service_1 = __importDefault(require("../services/user-image.service"));
const fs_1 = __importDefault(require("fs"));
class UserImageController {
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = res.locals;
            console.log(user);
            if (!req.file) {
                return res.status(400).json({
                    success: 'fail',
                    message: 'No file uploaded'
                });
            }
            if (req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg') {
                const result = yield user_image_service_1.default.save_image(req.file.originalname, req.file.path, user);
                return res.status(201).json({
                    status: 'success',
                    message: 'Image Saved Successfully...',
                    result: result
                });
            }
            fs_1.default.unlinkSync(req.file.path);
            return res.status(400).json({
                success: 'fail',
                message: `${req.file.originalname} is an Invalid file type we only allow png, jpg files`,
                path: req.file.path
            });
        });
    }
}
exports.default = new UserImageController();
