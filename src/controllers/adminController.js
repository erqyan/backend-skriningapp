const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllHasil = async (req, res) => {
  const hasil = await prisma.hasilSkrining.findMany({
    include: {
      user: true,
      skrining: true
    }
  });
  res.json(hasil);
};
