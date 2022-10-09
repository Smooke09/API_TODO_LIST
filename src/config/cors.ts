import cors from "cors";

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

const options: cors.CorsOptions = {
  credentials: false,
  allowedHeaders,
};

export default options;
