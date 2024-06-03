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
const user_image_model_1 = __importDefault(require("../models/user-image.model"));
const promises_1 = __importDefault(require("fs/promises"));
const user_model_1 = __importDefault(require("../models/user.model"));
class ImageService {
    // async save_image(filename: string, filepath: string, user_id: IImage) {
    //     try {
    //         const base64 = await this.convertToBase64(filepath);
    //         const user = await User.findById({ _id: user_id });
    //         console.log(user?._id);
    //         await Image.create({ filename, base64, user });
    //         await this.deleteFile(filepath);
    //     } catch (error: any | unknown) {
    //         console.log(`Error Saving Image ${error.message}`);
    //     }
    // }
    save_image(filename, filepath, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure user_id is a string
                if (Buffer.isBuffer(user_id)) {
                    user_id = user_id.toString('hex'); // or 'utf-8' depending on how the Buffer was created
                }
                const base64 = yield this.convertToBase64(filepath);
                const user = yield user_model_1.default.findById(user_id);
                if (!user) {
                    throw new Error('User not found');
                }
                console.log(user.id);
                yield user_image_model_1.default.create({ filename, base64, user_id: user._id });
                yield this.deleteFile(filepath);
            }
            catch (error) {
                console.log(`Error Saving Image: ${error.message}`);
            }
        });
    }
    convertToBase64(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield promises_1.default.readFile(filepath);
                return file.toString('base64');
            }
            catch (error) {
                console.error('Error converting to Base64:', error.message);
            }
        });
    }
    deleteFile(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.unlink(filepath);
            }
            catch (error) {
                console.error('Error deleting file:', error.message);
            }
        });
    }
}
exports.default = new ImageService();
