const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPertanyaan = async (req, res, next) => {
  try {
    const {
      skriningId,
      pertanyaan,
      tipe_jawaban,
      bobot,
      urutan
    } = req.body;

    // validasi sederhana
    if (!skriningId || !pertanyaan || !tipe_jawaban || bobot === undefined || urutan === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // pastikan skrining ada
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
      message: 'Pertanyaan skrining berhasil ditambahkan',
      data: created
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePertanyaan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pertanyaan, tipe_jawaban, bobot, urutan } = req.body;

    const existing = await prisma.pertanyaanSkrining.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Pertanyaan skrining tidak ditemukan'
      });
    }

    const updated = await prisma.pertanyaanSkrining.update({
      where: { id: Number(id) },
      data: {
        pertanyaan,
        tipe_jawaban,
        bobot,
        urutan
      }
    });

    res.json({
      success: true,
      message: 'Pertanyaan skrining berhasil diperbarui',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePertanyaan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.pertanyaanSkrining.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Pertanyaan skrining tidak ditemukan'
      });
    }

    await prisma.pertanyaanSkrining.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      message: 'Pertanyaan skrining berhasil dihapus'
    });
  } catch (err) {
    next(err);
  }
};
