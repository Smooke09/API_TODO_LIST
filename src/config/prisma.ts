import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default prisma;
