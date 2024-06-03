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
const validate_api_key = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const api_key = req.headers['x-api-key'];
    try {
        if (api_key === undefined) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are unauthorized'
            });
        }
        const user = yield user_model_1.default.findOne({ api_key: api_key });
        // console.log(user);
        if (user === null) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized'
            });
        }
        res.locals.user = user._id;
        console.log(res.locals.user);
        next();
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message,
            name: error.name,
            stack: error.stack
        });
    }
});
exports.default = validate_api_key;
