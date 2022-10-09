// Importando as Configurações do Servidor
import server from "./config/server";

// Iniciando o Servidor
server.listen(process.env.SERVER_PORT || 3333, () => {
  console.log("Server is running! 🚀");
});
