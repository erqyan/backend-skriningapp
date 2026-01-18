const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

exports.getPertanyaan = async (req, res, next) => {
  try {
    // pastikan user ada
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      throw new AppError('User tidak ditemukan', 404);
    }

    if (!user.kriteria_skrining) {
      throw new AppError('Kriteria skrining belum ditentukan', 400);
    }

    // ambil skrining sesuai kriteria user
    const skrining = await prisma.skrining.findFirst({
      where: {
        kriteria: user.kriteria_skrining,
        aktif: true
      },
      include: {
        pertanyaan: {
          orderBy: { urutan: 'asc' }
        }
      }
    });

    if (!skrining) {
      throw new AppError('Data skrining tidak tersedia', 404);
    }

    res.json({
      success: true,
      data: skrining
    });
  } catch (err) {
    next(err);
  }
};

exports.submitJawaban = async (req, res, next) => {
  try {
    const { skriningId, jawaban } = req.body;

    // validasi input
    if (!skriningId) {
      throw new AppError('skriningId wajib diisi', 400);
    }

    if (!Array.isArray(jawaban) || jawaban.length === 0) {
      throw new AppError('Jawaban skrining tidak boleh kosong', 400);
    }

    // cek skrining
    const skrining = await prisma.skrining.findUnique({
      where: { id: skriningId }
    });

    if (!skrining) {
      throw new AppError('Skrining tidak ditemukan', 404);
    }

    let totalSkor = 0;

    // simpan jawaban
    for (const j of jawaban) {
      if (
        j.pertanyaanId === undefined ||
        j.nilai === undefined
      ) {
        throw new AppError('Format jawaban tidak valid', 400);
      }

      if (j.nilai < 0 || j.nilai > 3) {
        throw new AppError(
          'Nilai jawaban harus berada pada rentang 0 sampai 3',
          400
        );
      }

      totalSkor += j.nilai;

      await prisma.jawabanSkrining.create({
        data: {
          userId: req.user.id,
          skriningId,
          pertanyaanId: j.pertanyaanId,
          nilai_jawaban: j.nilai
        }
      });
    }

    // tentukan kategori (contoh sederhana)
    let kategori = 'Ringan';
    if (totalSkor > 4 && totalSkor <= 8) kategori = 'Sedang';
    if (totalSkor > 8) kategori = 'Berat';

    // simpan hasil skrining
    const hasil = await prisma.hasilSkrining.create({
      data: {
        userId: req.user.id,
        skriningId,
        skor_total: totalSkor,
        kategori_hasil: kategori
      }
    });

    res.status(201).json({
      success: true,
      message: 'Skrining berhasil disimpan',
      data: hasil
    });
  } catch (err) {
    next(err);
  }
};

exports.getHasil = async (req, res, next) => {
  try {
    const hasil = await prisma.hasilSkrining.findMany({
      where: { userId: req.user.id },
      include: {
        skrining: true
      },
      orderBy: {
        tanggal_skrining: 'desc'
      }
    });

    if (!hasil || hasil.length === 0) {
      throw new AppError('Belum ada hasil skrining', 404);
    }

    res.json({
      success: true,
      data: hasil
    });
  } catch (err) {
    next(err);
  }
};
