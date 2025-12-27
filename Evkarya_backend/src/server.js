const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');


const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });


const connectDB = require('./config/db');
const bookingRoutes = require("./routes/bookingRoutes");
const postRoutes = require("./routes/postRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const authRoutes = require("./login/authRoutes");

const orderRoutes = require("./routes/orderRoutes");
const getPostRoute = require("./routes/getPostRoute");

const {authenticate} = require("./middleware/authenticate");
const {authorizeRoles} = require("./middleware/authorizeRoles");


const app = express();


app.use(express.json()); 
app.use(
  cors({
    origin: [
  "http://localhost:3000",
  "https://spiffy-squirrel-74422d.netlify.app"
],
    credentials: true,
  })
);


connectDB();


app.use("/api/posts", postRoutes);
app.use("/api/vendors",  vendorRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", getPostRoute);
app.use("/api", require("./routes/vendorOrder.routes"));

app.use("/api/bookings", bookingRoutes);
app.get('/', (req, res) => {
    console.log("I'M inside home page route handler");
    res.send("Welcome to EvKarya post database");
});



app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

