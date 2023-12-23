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
const CommentRouter = require("./routes/comment")

const cookieParser = require("cookie-parser");


// --------------- Security Middleweres ------------------
app.set('trust proxy', 1);
// const cors = require('cors');
// app.use(cors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 204,
// }));

// --------------- Security Middleweres ------------------
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    max: 100000, // max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
    message: 'Too many requests' // message to send
});
app.use(limiter);

// --------------- Parsers and FileUpload Config ------------------
app.use(cookieParser());
app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


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
app.use("/api/v1/comment", CommentRouter)


// connection with db --> connection with cloudinary --> listning on port 
async function runServer() {
    try {
        await connectDB(process.env.MONGO_URL)
        await connectCloudinary();
        app.listen(process.env.port || 5000, () => {
            console.log(`Listing on port ${process.env.port || 5000}`)
        })
    } catch (error) {
        console.log(error.message)
    }
}

runServer();