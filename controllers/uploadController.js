const fs = require("fs");
const path = require("path");
const db = require("../models/db");

exports.uploadImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Dosya yok!" });
    }
    //console.log(req.files);
    const imagePaths = req.files.map(file => `${file.filename}`);
    const carId = req.body.carId;
    // Veritabanına resimleri ekleyelim
    imagePaths.forEach(imagePath => {
        db.query("INSERT INTO images (imageurl,carId) VALUES (?,?)", [imagePath,carId], (err, result) => {
            if (err) {
                //console.error("Veritabanına kaydedilirken hata:", err);
                return res.status(500).json({ message: "Hata oluştu" });
            }
        });
    });

    res.json({ message: "Resimler başarıyla yüklendi!", imagePaths });
};

exports.deleteCar = (req, res) => {
    const carId = req.body.carId;
    const sql = "SELECT imageurl FROM images WHERE carId = ?";

    db.query(sql, [carId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Veritabanı hatası", error: err });
        }

        let deleteCount = 0;  // Başarılı silinen dosya sayısı
        let allImagesDeleted = true;

        // Eğer resimler varsa, bunları silmeye çalışalım
        if (results.length !== 0) {
            results.forEach((row, index) => {
                const filePath = path.join(__dirname, "../uploads", row.imageurl);  // Tam dosya yolu
                fs.unlink(filePath, (err) => {
                    if (err) {
                        //console.error(`Dosya silme hatası: ${filePath}`, err);
                        allImagesDeleted = false;  // Bir hata oluşursa
                    } else {
                        //console.log(`Dosya silindi: ${filePath}`);
                        deleteCount++;
                    }

                    // Eğer son resim silindiyse, 'images' tablosundaki kayıtları sil
                    if (index === results.length - 1) {
                        const deleteImagesSql = "DELETE FROM images WHERE carId = ?";
                        db.query(deleteImagesSql, [carId], (err) => {
                            if (err) {
                                return res.status(500).json({ message: "Veritabanından resimler silinemedi", error: err });
                            }
                        });
                    }
                });
            });
        }
            const deleteCarSql = "DELETE FROM cars WHERE id = ?";
            db.query(deleteCarSql, [carId], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Veritabanından araba kaydı silinemedi", error: err });
                }

                // Resimler silindiyse, işlemi başarılı bir şekilde bitirelim
                if (deleteCount > 0) {
                    res.json({ message: "Resimler ve araba başarıyla silindi" });
                } else if (allImagesDeleted) {
                    res.status(404).json({ message: "Hiçbir dosya silinemedi" });
                } else {
                    res.status(500).json({ message: "Bazı dosyalar silinemedi" });
                }
            });
    });
};
