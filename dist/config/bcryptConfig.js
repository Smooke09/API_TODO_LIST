"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const salt = 15;
async function hashPassword(password) {
    const hash = await bcrypt_1.default.hash(password, salt);
    return hash;
}
exports.default = hashPassword;
async function comparePassword(password, hash) {
    const compare = await bcrypt_1.default.compare(password, hash);
    return compare;
}
exports.comparePassword = comparePassword;
