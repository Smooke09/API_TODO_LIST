"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = __importDefault(require("./cors"));
const prisma_1 = __importDefault(require("./prisma"));
const bcryptConfig_1 = __importDefault(require("./bcryptConfig"));
const bcryptConfig_2 = require("./bcryptConfig");
const token_1 = require("./token");
// Criando uma colecancao de dados no Banco de dados Firebase
// instanciando express
const server = (0, express_1.default)();
// Configurando COrs para Habilitar o acesso externo
server.use((0, cors_1.default)(cors_2.default));
// definindo o tipo de dados que o express vai receber
server.use(express_1.default.json());
// diz para o express qual biblioteca ele deve utilizar para fazer o parsing do conteúdo das requisições que ele recebe.
server.use(express_1.default.urlencoded({ extended: true }));
// Req = Requeste
// Res = Response
// CRUD - Create, Read, Update, Delete
// Consultar - Read
server.get("/consultar/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
        const data = await prisma_1.default.users
            .findMany({
            where: {
                user_id: parseInt(id),
            },
            select: {
                user_id: true,
                username: true,
                email: true,
                tasks_tasks_user_idTousers: {
                    orderBy: {
                        task_id: "asc",
                    },
                },
            },
        })
            .catch((err) => {
            next(err);
        });
        // const data = await prisma.users
        //   .findUnique({
        //     where: {
        //       user_id: parseInt(id),
        //     },
        //     select: {
        //       user_id: true,
        //       username: true,
        //       email: true,
        //       tasks_tasks_user_idTousers: true,
        //       // Pegando referencia da chave estrangeira
        //     },
        //   })
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
    }
});
//Create - Create tasks
server.post("/create", async (req, res) => {
    const body = req.body;
    // Status Concluido, Fazendo, Pendente
    switch (req.body.status) {
        case "concluido":
            break;
        case "fazendo":
            break;
        case "pendente":
            break;
        default:
            return res.status(400).send("Status invalido");
            break;
    }
    const data = {
        description: body.description,
        status: body.status,
        user_id: body.user_id,
    };
    // Ver um forma de gerar uid Numerico
    // Criando uma task no banco de dados
    try {
        await prisma_1.default.tasks
            .create({
            data: data,
        })
            .catch((error) => {
            res.status(500).json({
                message: "Erro ao criar task!",
                error: error.message,
            });
        });
        res.status(200).json({
            message: "Task criada com sucesso!",
        });
    }
    catch (err) {
        console.log(err);
    }
});
//Create - User
server.post("/create/user", async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Dados invalidos!",
        });
    }
    try {
        const newPass = await (0, bcryptConfig_1.default)(password);
        const newUser = await prisma_1.default.users.create({
            data: {
                username,
                email,
                password: newPass,
            },
        });
        res.status(200).json({
            message: "Usuario criado com sucesso!",
        });
    }
    catch (error) {
        next(error.message);
    }
});
// Update - Update
server.put("/atualizar/:id", async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    // Status Concluido, Fazendo, Pendente
    switch (req.body.status) {
        case "concluido":
            break;
        case "fazendo":
            break;
        case "pendente":
            break;
        default:
            return res.status(400).send("Status invalido");
            break;
    }
    const data = {
        description: body.description,
        status: body.status,
        user_id: body.user_id,
    };
    try {
        await prisma_1.default.tasks
            .update({
            where: {
                task_id: parseInt(id),
            },
            data: data,
        })
            .catch((error) => {
            res.status(500).json({
                message: "Erro ao atualizar task!",
                error: error,
            });
        });
        res.status(200).json({
            message: "Task atualizada com sucesso!",
        });
    }
    catch (err) {
        console.log(err);
    }
});
// Delete - Delete
server.delete("/deletar/:id", async (req, res) => {
    const id = req.params.id;
    const { user_id } = req.body;
    try {
        const deleteTask = await prisma_1.default.tasks
            .delete({
            where: {
                task_id: parseInt(id),
            },
        })
            .catch((error) => {
            res.status(500).json({
                message: "Erro ao deletar task!",
                error: error.message,
            });
        });
        res.status(200).json({
            message: "Task deletada com sucesso!",
        });
    }
    catch (err) {
        console.log(err.message);
    }
});
// Login
server.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Dados invalidos!",
        });
    }
    try {
        // Verificando se o usuario existe
        const user = await prisma_1.default.users.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Usuario não encontrado!",
            });
        }
        // Verificando se a senha esta correta
        const validPassword = await (0, bcryptConfig_2.comparePassword)(password, user.password);
        // Validando password
        if (!validPassword) {
            return res.status(400).json({
                message: "Senha incorreta!",
            });
        }
        // Gerando token
        const token = await (0, token_1.genToken)(user.user_id);
        res.status(200).json({
            message: "Login realizado com sucesso!",
            data: Object.assign(Object.assign({}, user), { token }),
        });
    }
    catch (error) {
        next(error.message);
    }
});
exports.default = server;
