// Importando as Configurações do Servidor
import server from "./config/server";

const PORT = process.env.PORT || 3000;

// Iniciando o Servidor
server.listen(PORT, () => {
  console.log(`Server is running! ${PORT}🚀`);
});
