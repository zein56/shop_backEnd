const db = require("../models/db");

exports.getCarsInfoSelections = (req, res) => {
    const queries = [
        "SELECT * FROM fuel",
        "SELECT * FROM gear",
        "SELECT * FROM colors",
    ];
    const results = {};
    Promise.all(
        queries.map((query) =>
            new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            })
        )
    )
        .then((data) => {
            results.fuel = data[0];
            results.gear = data[1];
            results.colors = data[2];
            res.json(results);
        })
        .catch((err) => res.status(500).json({ error: "Veri hatası!", err }));
};
exports.getMakeAndModel = (req,res) => {
    const { table,column,id } = req.body;
  if (table == 'makes') {
    db.query('SELECT * FROM ?? ',[table], (err, result) => {
      if (err) {
        res.status(500).send('Hata oluştu: ' + err);
      } else {
        res.json({ message: 'Veriler gönderiliyor.', data: result });
      }
    });  
  }else{
    if (table == 'years'&&column == 'make_id') {
      db.query('SELECT * FROM models WHERE make_id = ?',[id], (err, result) => {
        if (err) {
          res.status(500).send('Hata oluştu: ' + err);//
        } else {
          db.query('SELECT * FROM ?? WHERE model_id = ?',[table,result[0].model_id], (err, result) => {
            if (err) {
              res.status(500).send('Hata oluştu: ' + err);
            } else {
              res.json({ message: 'Veriler gönderiliyor.', data: result });
            }
          }); 
        }
      }); 
    }else{
      db.query('SELECT * FROM ?? WHERE ?? = ?',[table,column,id], (err, result) => {
        if (err) {
          res.status(500).send('Hata oluştu: ' + err);
        } else {
          res.json({ message: 'Veriler gönderiliyor.', data: result });
        }
      }); 
    }
  }
}
exports.addCar = (req,res) =>{
  const {
    date,makeId,ModelId,yearId,fuelId,gearId,KM,enginePower,color,description,
    warranty,condition,tradeIn,userId,celler,phoneNumber,address,price
  } = req.body;
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  const sql = `INSERT INTO cars (date,makeId,ModelId,yearId,fuelId,gearId,KM,enginePower,color,description,
              warranty, \`condition\`, \`tradeIn\`,userId,celler,phoneNumber,address,price)
               VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?,?)`;
  db.query(sql, [formattedDate,makeId,ModelId,yearId,fuelId,gearId,KM,enginePower,color,description,
    warranty,condition,tradeIn,userId,celler,phoneNumber,address,price], (err, result) => {
    if (err) {
        console.error('Veri ekleme hatası:', err);
        res.status(500).send('Veri eklenirken hata oluştu.');
    } else {
        const insertedId = result.insertId;
        res.status(200).send({message:'Veri başarıyla eklendi.',id:insertedId}); 
    }
  });
}

exports.getAllCars = (req,res) =>{
  db.query(`SELECT 
    cars.id,
    cars.date,
    makes.name AS makeName,
    models.name AS modelName,
    cars.yearId,
    fuel.fuelType AS fuelType,
    gear.gearType AS gearType,
    cars.KM,
    cars.enginePower,
    colors.colorName AS color,
    cars.description,
    cars.warranty,
    cars.condition,
    cars.tradeIn,
    users.name AS userName,
    cars.celler,
    cars.phoneNumber,
    cars.address,
    cars.price
FROM 
    cars
LEFT JOIN makes ON cars.makeId = makes.make_id
LEFT JOIN models ON cars.ModelId = models.model_id
LEFT JOIN fuel ON cars.fuelId = fuel.id
LEFT JOIN gear ON cars.gearId = gear.id
LEFT JOIN users ON cars.userId = users.id
LEFT JOIN colors ON cars.color = colors.id;`, (err, results) => {
    if (err) {
      res.status(500).send('Veritabanı hatası');
      return;
    }
    res.json(results);
  });
};

exports.getCarImages = (req,res) => {
  const {carId} = req.body;
  const sql = "SELECT * FROM images WHERE carId = ?";

  db.query(sql,[carId],(err,results) => {
      if (err) return res.status(500).json({message:"resimler getirilmedi!!"});
      res.json({message:'resimler bulundu1',images:results});
  });
};

exports.getCar = (req, res) => {
  const carId = req.body.carId;
  //console.log('get cars',carId)
  // Arabayı çek
  
  const carSql = `SELECT 
    cars.id,
    cars.date,
    makes.name AS makeName,
    models.name AS modelName,
    cars.yearId,
    fuel.fuelType AS fuelType,
    gear.gearType AS gearType,
    cars.KM,
    cars.enginePower,
    colors.colorName AS color,
    cars.description,
    cars.warranty,
    cars.condition,
    cars.tradeIn,
    users.id AS cellerId,
    cars.celler,
    cars.phoneNumber,
    cars.address,
    cars.price
FROM 
    cars
LEFT JOIN makes ON cars.makeId = makes.make_id
LEFT JOIN models ON cars.ModelId = models.model_id
LEFT JOIN fuel ON cars.fuelId = fuel.id
LEFT JOIN gear ON cars.gearId = gear.id
LEFT JOIN users ON cars.userId = users.id
LEFT JOIN colors ON cars.color = colors.id WHERE cars.id = ?`;
  const imagesSql = "SELECT * FROM images WHERE carId = ?";

  db.query(carSql, [carId], (carErr, carResults) => {
      if (carErr) return res.status(500).json({ message: "Araba getirilemedi!" });

      if (carResults.length === 0) {
          return res.status(404).json({ message: "Araba bulunamadı." });
      }

      const carInfo = carResults[0]; 

      db.query(imagesSql, [carId], (imgErr, imgResults) => {
          if (imgErr) return res.status(500).json({ message: "Resimler getirilemedi!" });

          const carImages = imgResults.map((img) => img.imageurl);

          res.json({
              message: 'Resimler bulundu!',
              carInfo: carInfo,
              carImages: carImages
          });
      });
  });
};






/**
 * 
 * app.listen(4000,() => {
    console.log('server: http://localhost:4000');
})
 * 
 * app.get('/CarsInfoSelections',(req,res) => {
  const queries = [
    'SELECT * FROM fuel',
    'SELECT * FROM gear',
    'SELECT * FROM colors',
  ]
  const results = {};
  Promise.all(
    queries.map((query,index) => 
      new Promise((resolve,reject) =>{
        db.query(query,(err,result) =>{
          if (err) reject(err);
          else resolve({[`table${index+1}`]:result});
        });
      }) 
    )
  ).then((data) =>{
    data.forEach((tableData) => Object.assign(results,tableData));
    //console.log(data);
    res.json(results); 
    }
  ).catch((err)=>{
    //console.error("Veri hatasi olustu!!");
    res.status(500).json({error:"veri hatasi!!",err});
  })
})
// Diğer metodlar buraya eklenebilir...
const express = require('express');
const db = require('./models/db.js');
const bodyParser = require('body-parser');
//const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // CORS'u etkinleştir
app.use(express.json()); // JSON verilerini işlemek için

 
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send('Veritabanı hatası');
      return;
    }
    res.json(results);
  });
});

app.post('/user', (req, res) => { 
  const id = req.body.id;
  //console.log(id)
  db.query('SELECT * FROM users WHERE id = ?',[id],(error,results) =>{
    if (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).send('Veritabanı hatası');
      return;
    }else {
      //console.log(results[0]);
      res.json(results[0]);
    }
  });
});
app.post('/addUser', (req, res) => {
  const { name,lastname,phoneNum, email,userPassword } = req.body;
  const sql = 'INSERT INTO users (name,lastName,phoneNumber,email,userPassword) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name,lastname,phoneNum, email,userPassword], (err, result) => {
      if (err) {
          console.error('Veri ekleme hatası:', err);
          res.status(500).send('Veri eklenirken hata oluştu.');
      } else {
          res.status(200).send('Veri başarıyla eklendi.');
      }
  });
});
app.post('/checkEmail',(req,res) => {
  const email = req.body.email;

  db.query('SELECT * FROM users WHERE email = ?',[email],(error,results) =>{
    if (error) return res.status(200).json({ message: 'Veritabanı hatası' ,value:0 });
    if (results.length > 0) return res.status(200).json({ message: 'Bu e-posta adresi zaten kullanımda.' ,value:0 });
    return res.status(200).json({ message: 'E-posta kullanılabilir.' ,value:1});
  })
}) 
app.post('/LogIn', (req, res) => {
  const {email,password} = req.body;
  db.query('SELECT * FROM users WHERE email = ?',[email],(error,results) =>{
    if (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).send('Veritabanı hatası');
      return;
    }

    if (results.length === 0) {
      res.json({ value: 0,message:'Kullanıcı bulunamadı'});
    } else {
      if (results[0].userPassword == password) {
        res.json({ value: 1,message:'giris yapildi!',userInfo:results[0] });
      }else{
        res.json({ value: 0,message:'sifre hatali!' });
      }
      
    }
  });
});
*/