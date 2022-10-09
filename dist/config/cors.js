"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Enderecos que ele vai aceitar
// const allowedOrigins = ["http://localhost:5173/", "http://192.168.15.37:5173/"];
const allowedHeaders = [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Access-Control-Allow-Origin",
];
const options = {
    credentials: false,
    allowedHeaders,
};
exports.default = options;
