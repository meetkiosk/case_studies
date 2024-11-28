import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  await prisma.user.create({
    data: {
      id: "1",
      firstName: "Jean-Marc",
      lastName: "Janco",
    },
  });
}

main().then(console.log).catch(console.error);
