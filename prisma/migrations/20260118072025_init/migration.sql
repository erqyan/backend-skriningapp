-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL,
    `kriteria_skrining` ENUM('PHQ4', 'EPDS') NULL,
    `nik` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATETIME(3) NOT NULL,
    `jenis_kelamin` VARCHAR(191) NOT NULL,
    `no_telp` VARCHAR(191) NOT NULL,
    `provinsi` VARCHAR(191) NOT NULL,
    `kabupaten_kota` VARCHAR(191) NOT NULL,
    `kecamatan` VARCHAR(191) NOT NULL,
    `kelurahan` VARCHAR(191) NOT NULL,
    `pendidikan` VARCHAR(191) NOT NULL,
    `pekerjaan` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skrining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kriteria` ENUM('PHQ4', 'EPDS') NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PertanyaanSkrining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skriningId` INTEGER NOT NULL,
    `pertanyaan` VARCHAR(191) NOT NULL,
    `tipe_jawaban` VARCHAR(191) NOT NULL,
    `bobot` INTEGER NOT NULL,
    `urutan` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JawabanSkrining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `skriningId` INTEGER NOT NULL,
    `pertanyaanId` INTEGER NOT NULL,
    `nilai_jawaban` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HasilSkrining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `skriningId` INTEGER NOT NULL,
    `skor_total` INTEGER NOT NULL,
    `kategori_hasil` VARCHAR(191) NOT NULL,
    `tanggal_skrining` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RekomendasiTindakan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skriningId` INTEGER NOT NULL,
    `skor_min` INTEGER NOT NULL,
    `skor_max` INTEGER NOT NULL,
    `deskripsi_tindakan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PertanyaanSkrining` ADD CONSTRAINT `PertanyaanSkrining_skriningId_fkey` FOREIGN KEY (`skriningId`) REFERENCES `Skrining`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JawabanSkrining` ADD CONSTRAINT `JawabanSkrining_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JawabanSkrining` ADD CONSTRAINT `JawabanSkrining_skriningId_fkey` FOREIGN KEY (`skriningId`) REFERENCES `Skrining`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JawabanSkrining` ADD CONSTRAINT `JawabanSkrining_pertanyaanId_fkey` FOREIGN KEY (`pertanyaanId`) REFERENCES `PertanyaanSkrining`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilSkrining` ADD CONSTRAINT `HasilSkrining_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilSkrining` ADD CONSTRAINT `HasilSkrining_skriningId_fkey` FOREIGN KEY (`skriningId`) REFERENCES `Skrining`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekomendasiTindakan` ADD CONSTRAINT `RekomendasiTindakan_skriningId_fkey` FOREIGN KEY (`skriningId`) REFERENCES `Skrining`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
