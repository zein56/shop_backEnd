const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/usersRoutes");
const carsRoutes = require("./routes/carsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require('path');

const app = express();

// PORT: Railway veya Render için process.env.PORT kullan, local test için 4000
const PORT = process.env.PORT || 4000;

// FRONTEND URL: Cloud ortamında frontend URL’nizi buraya yazabilirsiniz
// Local test için localhost:3000
const FRONTEND_URL = process.env.FRONTEND_URL ;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use(usersRoutes);
app.use(carsRoutes);
app.use(uploadRoutes);

// Upload klasörünü serve et
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server başlat
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
