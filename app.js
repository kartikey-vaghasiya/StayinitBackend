const express = require("express")
const app = express();
const fileupload = require("express-fileupload")
// >>> security packages
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require("cors")
// >>> config packages
require('dotenv').config();
const connectDB = require("./config/database")
const connectCloudinary = require("./config/cloudinary")
// >>> routers
const AuthRouter = require("./routes/auth")
const CommentRouter = require("./routes/comment")
const FileRouter = require("./routes/file")
const FlatRouter = require("./routes/flat")
const HostelRouter = require("./routes/hostel")
const ProfileRouter = require("./routes/profile")
const WishlistRouter = require("./routes/wishlist")



// >>> security middlewares 
app.use(cors("*"))
app.set('trust proxy', 1);
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
    max: 100000, // max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
    message: 'Too many requests' // message to send
});

app.use(limiter);

// >>> parser middlewares

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


// >>> use Routers 
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/profile", ProfileRouter)
app.use("/api/v1/flat", FlatRouter)
app.use("/api/v1/hostel", HostelRouter)
app.use("/api/v1/wishlist", WishlistRouter)
app.use("/api/v1/comment", CommentRouter)
app.use("/api/v1/file", FileRouter)


// >>> starting and connecting with server and db
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