import fs from 'fs';
import multer from "multer";
import crypto from "crypto";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

// Получаем __dirname для ES6 модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Функция для генерации уникального имени файла
const generateFilename = (originalName) => {
	const fileExtension = path.extname(originalName); // Получаем расширение файла
	const uniqueSuffix = crypto.randomBytes(2).toString('hex'); // Генерация уникального суффикса
	return `${Date.now()}-${uniqueSuffix}${fileExtension}`;
};

// Настройка хранилища для multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.join(__dirname, 'client', 'public', 'upload');

		// Проверка существования директории, создание если не существует
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}

		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const uniqueFilename = generateFilename(file.originalname);
		cb(null, uniqueFilename);
	},
});

// Фильтрация файлов по MIME типу (опционально)
const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Разрешенные MIME типы
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true); // Разрешаем загрузку файла
	} else {
		cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false); // Отклоняем файл
	}
};

// Создание экземпляра загрузчика multer
const upload = multer({
	storage: storage,
	fileFilter: fileFilter, // Опциональная фильтрация по MIME типу
	limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла до 5MB (опционально)
});

export default upload;