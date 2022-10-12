import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import corsOptions from "./cors";
import prisma from "./prisma";
import hashPassword from "./bcryptConfig";
import { comparePassword } from "./bcryptConfig";
import { genToken } from "./token";

// Criando uma colecancao de dados no Banco de dados Firebase

// instanciando express
const server = express();

// Configurando COrs para Habilitar o acesso externo
server.use(cors(corsOptions));

// definindo o tipo de dados que o express vai receber
server.use(express.json());

// diz para o express qual biblioteca ele deve utilizar para fazer o parsing do conteúdo das requisições que ele recebe.
server.use(express.urlencoded({ extended: true }));

// Req = Requeste
// Res = Response

// CRUD - Create, Read, Update, Delete

// Consultar - Read
server.get(
  "/consultar/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const data = await prisma.users
        .findUnique({
          where: {
            user_id: parseInt(id),
          },
          select: {
            user_id: true,
            username: true,
            email: true,
            tasks_tasks_user_idTousers: true, // Pegando referencia da chave estrangeira
          },
        })
        .catch((err: any) => {
          next(err);
        });
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
);

//Create - Create tasks
server.post("/create", async (req: Request, res: Response) => {
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
    await prisma.tasks
      .create({
        data: data,
      })
      .catch((error: any) => {
        res.status(500).json({
          message: "Erro ao criar task!",
          error: error,
        });
      });

    res.status(200).json({
      message: "Task criada com sucesso!",
    });
  } catch (err: any) {
    console.log(err);
  }
});

//Create - User
server.post(
  "/create/user",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Dados invalidos!",
      });
    }

    try {
      const newPass = await hashPassword(password);

      const newUser = await prisma.users.create({
        data: {
          username: username,
          email: email,
          password: newPass,
        },
      });

      res.status(200).json({
        message: "Usuario criado com sucesso!",
      });
    } catch (error) {
      next(error.message);
    }
  }
);

// Update - Update
server.put("/atualizar/:id", async (req: Request, res: Response) => {
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
    await prisma.tasks
      .update({
        where: {
          task_id: parseInt(id),
        },
        data: data,
      })
      .catch((error: any) => {
        res.status(500).json({
          message: "Erro ao atualizar task!",
          error: error,
        });
      });

    res.status(200).json({
      message: "Task atualizada com sucesso!",
    });
  } catch (err: any) {
    console.log(err);
  }
});

// Delete - Delete
server.delete("/deletar/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const { user_id } = req.body;

  try {
    const deleteTask = await prisma.tasks
      .delete({
        where: {
          task_id: parseInt(id),
        },
      })
      .catch((error: any) => {
        res.status(500).json({
          message: "Erro ao deletar task!",
          error: error.message,
        });
      });

    res.status(200).json({
      message: "Task deletada com sucesso!",
    });
  } catch (err: any) {
    console.log(err.message);
  }
});

server.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Dados invalidos!",
      });
    }

    try {
      // Verificando se o usuario existe
      const user = await prisma.users.findFirst({
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
      const validPassword = await comparePassword(password, user.password);

      // Validando password
      if (!validPassword) {
        return res.status(400).json({
          message: "Senha incorreta!",
        });
      }

      // Gerando token
      const token = await genToken(user.user_id);

      res.status(200).json({
        message: "Login realizado com sucesso!",
        data: {
          ...user,
          token,
        },
      });
    } catch (error) {
      next(error.message);
    }
  }
);

export default server;
