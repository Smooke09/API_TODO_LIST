"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.genToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function genToken(userId) {
    const token = await (0, jsonwebtoken_1.sign)({
        _id: userId,
    }, process.env.SECRET_KEY, {
        expiresIn: "5h",
    });
    return token;
}
exports.genToken = genToken;
async function verifyToken(token) {
    const data = await (0, jsonwebtoken_1.verify)(token, process.env.SECRET_KEY);
    console.log(data);
    return data;
}
exports.verifyToken = verifyToken;
