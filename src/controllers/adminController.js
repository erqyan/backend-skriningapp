const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllHasil = async (req, res, next) => {
  try {
    const hasil = await prisma.hasilSkrining.findMany({
      include: {
        user: true,
        skrining: true
      }
    });
    res.json(hasil);
  } catch (err) {
    next(err);
  }
};

exports.createPertanyaan = async (req, res, next) => {
  try {
    const { skriningId, pertanyaan, tipe_jawaban, bobot, urutan } = req.body;

    if (!skriningId || !pertanyaan || !tipe_jawaban || bobot === undefined || urutan === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    const skrining = await prisma.skrining.findUnique({
      where: { id: Number(skriningId) }
    });

    if (!skrining) {
      return res.status(404).json({
        success: false,
        message: 'Skrining tidak ditemukan'
      });
    }

    const created = await prisma.pertanyaanSkrining.create({
      data: {
        skriningId: Number(skriningId),
        pertanyaan,
        tipe_jawaban,
        bobot: Number(bobot),
        urutan: Number(urutan)
      }
    });

    res.status(201).json({
      success: true,
      data: created
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePertanyaan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await prisma.pertanyaanSkrining.update({
      where: { id: Number(id) },
      data: req.body
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePertanyaan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.pertanyaanSkrining.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      message: 'Pertanyaan berhasil dihapus'
    });
  } catch (err) {
    next(err);
  }
};
