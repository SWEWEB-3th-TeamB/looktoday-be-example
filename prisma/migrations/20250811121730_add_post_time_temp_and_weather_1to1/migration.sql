/*
  Warnings:

  - The primary key for the `weather` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `field1` on the `weather` table. All the data in the column will be lost.
  - You are about to drop the column `field2` on the `weather` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[looktodayId]` on the table `Weather` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gungu` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pty` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reh` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sido` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmp` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuu` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vec` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vvv` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weatherId` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wsd` to the `Weather` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `weather` DROP FOREIGN KEY `Weather_looktodayId_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `temp` DOUBLE NULL,
    ADD COLUMN `time` VARCHAR(191) NULL,
    MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `weather` DROP PRIMARY KEY,
    DROP COLUMN `field1`,
    DROP COLUMN `field2`,
    ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `gungu` VARCHAR(191) NOT NULL,
    ADD COLUMN `lgt` INTEGER NULL,
    ADD COLUMN `pcp` VARCHAR(191) NULL,
    ADD COLUMN `pty` INTEGER NOT NULL,
    ADD COLUMN `reh` INTEGER NOT NULL,
    ADD COLUMN `sido` VARCHAR(191) NOT NULL,
    ADD COLUMN `time` VARCHAR(191) NOT NULL,
    ADD COLUMN `tmp` DOUBLE NOT NULL,
    ADD COLUMN `uuu` DOUBLE NOT NULL,
    ADD COLUMN `vec` INTEGER NOT NULL,
    ADD COLUMN `vvv` DOUBLE NOT NULL,
    ADD COLUMN `weatherId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `wsd` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`weatherId`);

-- CreateIndex
CREATE UNIQUE INDEX `Weather_looktodayId_key` ON `Weather`(`looktodayId`);

-- CreateIndex
CREATE INDEX `Weather_looktodayId_idx` ON `Weather`(`looktodayId`);

-- AddForeignKey
ALTER TABLE `Weather` ADD CONSTRAINT `Weather_looktodayId_fkey` FOREIGN KEY (`looktodayId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
