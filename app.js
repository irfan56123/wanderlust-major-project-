
if(process.env.NODE_ENV != "production") {
 require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utills/ExpressError.js");
const Listing = require("./models/listing.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");





const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require('passport');
const localStrategy = require('passport-local')
const User = require("./models/user.js");

app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");


const dbUrl = process.env.ATLASDB_URL;

main().then((res) => {
    console.log("conncted to DB");
})
    .catch(err => console.log(err));


async function main() {
    
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));  // use because let id = req.params;
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
     touchAfter: 24 * 3600,

});


const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); 
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success =  req.flash("success");
     res.locals.error =  req.flash("error");
     res.locals.currUser = req.user;
    next();
});



// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "irfan-ahmad",
//     });
//    let resisterdUser = await User.register(fakeUser, "helloworld");
//    res.send(resisterdUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// error Handling
app.use((err, req, res, next) => {
    let { status = 500, message = "something wnt wrong" } = err;
    // res.status(status).send(message);
    res.render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("severer is listening om 8080 port");
});