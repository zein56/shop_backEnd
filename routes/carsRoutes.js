const express = require("express");
const router = express.Router();
const carsController = require("../controllers/carsController");

// Araç rotaları
router.get("/CarsInfoSelections", carsController.getCarsInfoSelections);
router.post("/carsMake-model", carsController.getMakeAndModel);
router.post("/addCarToCell", carsController.addCar);
router.get("/getAllCars", carsController.getAllCars); 
router.post("/carImages", carsController.getCarImages);
router.post("/getCar",carsController.getCar);

module.exports = router;
 