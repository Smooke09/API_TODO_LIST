"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importando as Configurações do Servidor
const server_1 = __importDefault(require("./config/server"));
const PORT = process.env.PORT || 3000;
// Iniciando o Servidor
server_1.default.listen(PORT, () => {
    console.log(`Server is running! ${PORT}🚀`);
});
