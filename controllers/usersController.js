const db = require("../models/db");

exports.getUsers = (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).send("Veritabanı hatası");
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.body;
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).send("Veritabanı hatası");
        res.json(results[0]);
    });
};

exports.addUser = (req, res) => { 
    const { name, lastname, phoneNum, email, userPassword } = req.body;
    const sql = "INSERT INTO users (name, lastName, phoneNumber, email, userPassword) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, lastname, phoneNum, email, userPassword], (err) => {
        if (err) return res.status(500).send("Veri eklenirken hata oluştu.");
    });
};

exports.checkEmail = (req, res) => {
    const { email } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).send("Veritabanı hatası");
        if (results.length > 0) {
            return res.status(200).json({ message: "Bu e-posta adresi kullanımda.", value: 0 });
        }
        res.status(200).json({ message: "E-posta kullanılabilir.", value: 1 });
    });
};

exports.logIn = (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).send("Veritabanı hatası");
        if (results.length === 0) {
            res.json({ value: 0, message: "Kullanıcı bulunamadı" });
        } else if (results[0].userPassword === password) {
            res.json({ value: 1, message: "Giriş başarılı", userInfo: results[0] });
        } else {
            res.json({ value: 0, message: "Şifre hatalı!" });
        }
    });
};
