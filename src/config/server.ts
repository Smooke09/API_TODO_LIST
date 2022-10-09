import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import firebaseApp from "./connection";
import corsOptions from "./cors";



// Criando uma colecancao de dados no Banco de dados Firebase
const tasks = firebaseApp.firestore().collection("tasks");

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
server.get("/consultar", async (req: Request, res: Response) => {
  try {
    const snapshot = await tasks.get();
    const data = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        status: doc.data().status,
      };
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Consultar por ID - Read
server.get("/consultar/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    tasks
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.data) {
          res.status(200).json({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            status: doc.data().status,
          });
        } else {
          return res.status(404).send("Task nao encontrada!");
        }
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Create - Create
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
    title: body.title,
    description: body.description,
    status: body.status,
  };

  // Ver um forma de gerar uid Numerico

  // Criando uma task no banco de dados
  try {
    await tasks
      .add(data)
      .then((response) => {
        res.status(200).json({
          message: "Task criada com sucesso!",
          id: response?.id,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Erro ao criar task!",
          error: error,
        });
      });
  } catch (err) {
    console.log(err);
  }
});

// Update - Update
server.put("/atualizar/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const newBody = req.body;

  const data = {
    title: newBody.title,
    description: newBody.description,
    status: newBody.status,
  };

  try {
    const task = await tasks.doc(id).get();

    let taskData = task.data();

    const newData = {
      title: newBody.title ? newBody.title : taskData?.title,
      description: newBody.description
        ? newBody.description
        : taskData?.description,
      status: newBody.status ? newBody.status : taskData?.status,
    };

    if (!task.exists) {
      res.status(404).json({
        message: "Task não encontrada!",
      });
    } else {
      await tasks
        .doc(id)
        .update(newData)
        .then((response) => {
          res.status(200).json({
            message: "Task atualizada com sucesso!",
            id: response?.id,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Erro ao atualizar task!",
            error: error,
          });
        });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete - Delete
server.delete("/deletar/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    tasks
      .doc(id)
      .delete()
      .then(() => {
        res.status(200).json({
          message: "Task deletada com sucesso!",
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Erro ao deletar task!",
          error: error,
        });
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default server;
