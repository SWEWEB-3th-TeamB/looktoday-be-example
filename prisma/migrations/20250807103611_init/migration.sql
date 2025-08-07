-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `si` VARCHAR(191) NULL,
    `gungu` VARCHAR(191) NULL,
    `apparent_temp` ENUM('FREEZING', 'COLD', 'COOL', 'WARM', 'HOT', 'VERY_HOT') NULL,
    `apparent_humidity` ENUM('DRY', 'NORMAL', 'HUMID') NULL,
    `isPublic` BOOLEAN NOT NULL,
    `comment` VARCHAR(40) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Weather` (
    `looktodayId` INTEGER NOT NULL,
    `field1` VARCHAR(191) NULL,
    `field2` VARCHAR(191) NULL,

    PRIMARY KEY (`looktodayId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Weather` ADD CONSTRAINT `Weather_looktodayId_fkey` FOREIGN KEY (`looktodayId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
