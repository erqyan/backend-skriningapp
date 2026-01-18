const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

exports.register = async (req, res, next) => {
  try {
    const {
      nama,
      email,
      password,
      kriteria_skrining,

      nik,
      tanggal_lahir,
      jenis_kelamin,
      no_telp,

      provinsi,
      kabupaten_kota,
      kecamatan,
      kelurahan,

      pendidikan,
      pekerjaan
    } = req.body;

    if (
      !nama || !email || !password || !kriteria_skrining ||
      !nik || !tanggal_lahir || !jenis_kelamin || !no_telp ||
      !provinsi || !kabupaten_kota || !kecamatan || !kelurahan ||
      !pendidikan || !pekerjaan
    ) {
      throw new AppError('Data registrasi tidak lengkap', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email sudah terdaftar', 400);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password_hash: hash,
        role: 'USER',
        kriteria_skrining,

        nik,
        tanggal_lahir: new Date(tanggal_lahir),
        jenis_kelamin,
        no_telp,

        provinsi,
        kabupaten_kota,
        kecamatan,
        kelurahan,

        pendidikan,
        pekerjaan
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user_id: user.id
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Email atau password salah', 401);
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new AppError('Email atau password salah', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};
