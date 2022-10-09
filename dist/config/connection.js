"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("firebase"));
require("firebase/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKE,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};
// Iniciando Firebase
const firebaseApp = firebase_1.default.initializeApp(firebaseConfig);
console.log("Firebase Connection 🚀");
exports.default = firebaseApp;
