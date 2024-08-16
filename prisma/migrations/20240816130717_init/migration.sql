-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `coverPicture` VARCHAR(300) NULL,
    `profilePicture` VARCHAR(300) NULL,
    `city` VARCHAR(45) NULL,
    `website` VARCHAR(45) NULL,

    UNIQUE INDEX `Users_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(200) NULL,
    `img` VARCHAR(200) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `userId`(`userId`),
    UNIQUE INDEX `Posts_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    INDEX `commentUserId`(`userId`),
    INDEX `postId`(`postId`),
    UNIQUE INDEX `Comments_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    INDEX `likeUserId`(`userId`),
    INDEX `likePostId`(`postId`),
    UNIQUE INDEX `Likes_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `img` VARCHAR(200) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `storyUserId`(`userId`),
    UNIQUE INDEX `Stories_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Relationships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `followerUserId` INTEGER NOT NULL,
    `followedUserId` INTEGER NOT NULL,

    INDEX `followerUser`(`followerUserId`),
    INDEX `followedUser`(`followedUserId`),
    UNIQUE INDEX `Relationships_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `commentUserId` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `postId` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `likeUserId` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `likePostId` FOREIGN KEY (`postId`) REFERENCES `Posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stories` ADD CONSTRAINT `storyUserId` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relationships` ADD CONSTRAINT `followerUser` FOREIGN KEY (`followerUserId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relationships` ADD CONSTRAINT `followedUser` FOREIGN KEY (`followedUserId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
