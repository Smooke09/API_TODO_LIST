import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function genToken(userId: number) {
  const token = await sign(
    {
      _id: userId,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "5h",
    }
  );

  return token;
}

export async function verifyToken(token: any) {
  const data = await verify(token, process.env.SECRET_KEY);

  console.log(data);
  return data;
}
