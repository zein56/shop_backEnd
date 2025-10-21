const express = require("express");  // Express modülünü içe aktar
const router = express.Router();  // Router'ı başlat
const uploadController = require("../controllers/uploadController");
const multer = require("multer");
const path = require("path");  // Path modülünü içe aktar
const { v4: uuidv4 } = require('uuid');

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Yükleme klasörü
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, uuidv4());  // Dosya adını oluştur
    }
});

// Multer ayarları
const upload = multer({
    storage: storage,
    limits: { files: 10 },  // Maksimum 10 dosya
});

// Çoklu dosya yüklemek için `.array()`
router.post("/upload", upload.array('images', 10), uploadController.uploadImages);

router.delete("/deleteCar", uploadController.deleteCar);

module.exports = router;  // Router'ı dışarı aktar
