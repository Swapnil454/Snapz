require('dotenv').config()

const express = require("express")
const path = require("path")
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const { checkForAuthonticationCookie } = require("./middlewares/authenticcation")
const Blog = require('./models/blog')

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
.then((e) => console.log("mongodb connected"));

app.set("view engine", 'ejs');
app.set("views", path.resolve("./views"));

app.use(cookieParser());
app.use(checkForAuthonticationCookie("token"));
// app.use(express.static(path.resolve('./public')));// additional
app.use(express.static(path.resolve(__dirname, 'public')));

app.use(express.urlencoded({extended : false}));

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user', userRoute)
app.use("/blog",blogRoute)

app.listen( PORT, () => console.log(`Server Started At Port : ${PORT}`))