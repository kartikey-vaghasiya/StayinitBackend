const express = require("express")
const app = express();
const fileupload = require("express-fileupload")
require('dotenv').config();

const connectDB = require("./config/database")
const connectCloudinary = require("./config/cloudinary")

// --------------- Routers ------------------
const AuthRouter = require("./routes/auth");
const FileRouter = require("./routes/file")
const HostelRouter = require("./routes/hostel")
const FlatRouter = require("./routes/flat")
const WishlistRouter = require("./routes/wishlist")

const cookieParser = require("cookie-parser");


// --------------- Security Middleweres ------------------
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// app.use(
//     rateLimiter({
//         windowMs: 15 * 60 * 1000,
//         max: 60,
//     })
// );
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(xss());
app.use(mongoSanitize());

// --------------- Parsers and FileUpload Config ------------------
app.use(cookieParser());
app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

// --------------- use Routers ------------------
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/file", FileRouter)
app.use("/api/v1/flat", FlatRouter)
app.use("/api/v1/hostel", HostelRouter)
app.use("/api/v1/wishlist", WishlistRouter)


// connection with db --> connection with cloudinary --> listning on port 
async function runServer() {
    try {
        await connectDB(process.env.MONGO_URL)
        await connectCloudinary();
    } catch (error) {
        console.log(error)
    }
    app.listen(process.env.port || 5000, () => {
        console.log(`Listing on port ${process.env.port || 5000}`)
    })
}

runServer();