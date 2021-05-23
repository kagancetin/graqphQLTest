const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const logger = require("morgan");
const helmet = require("helmet");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { connectDB } = require("./db");
require("./helpers/passport/local");

//*** HANDLEBARS HELPERS ***/
const handlebarsHelpers = require("./helpers/handlebarsHelpers");
const helpers = require("handlebars-helpers")();
const allHelpers = { ...helpers, ...handlebarsHelpers };
//*** HANDLEBARS HELPERS ***/

//*** ROUTERS ***/
let admin = require("./router/admin/main");
let client = require("./router/client/index");
let login = require("./router/login");

const app = express();
connectDB();

// Basic Security - Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
// Basic Security - Helmet
// Bodyparser
app.use(express.json({ limit: "50mb" })).use(
  express.urlencoded({
    extended: true,
  })
);
// Bodyparser
// Public explanation
app.use(express.static(path.join(__dirname, "public")));
// Public explanation
// Morgan explanation
app.use(logger("dev"));
// Morgan explanation
// Template Engine
const hbs = exphbs.create({
  extname: "handlebars",
  defaultLayout: "client",
  helpers: allHelpers,
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
// Template Engine
//Cookie Parser
app.use(cookieParser("white rabbit"));
//Cookie Parser
// Session
app.use(
  session({
    secret: "white rabbit",
    resave: true,
    saveUninitialized: true,
  })
);
// Session
// Connect Flash
app.use(flash());
// Connect Flash
// Passport

app.use(passport.initialize());
app.use(passport.session());
// Passport

app.use(async (req, res, next) => {
  res.locals.flashMessages = {
    error: req.flash("error"),
    success: req.flash("success"),
    warning: req.flash("warning"),
  };

  if (req.user) {
    console.log("auth user", req.user);
    if (req.user.admin) {
      res.locals.admin = req.user;
    } else {
      res.locals.customer = req.user;
    }
  }
  next();
});

//Routes

app.use("/login", login);
app.use("/admin", admin);
app.use("/", client);

//Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  //Respond to client
  res.status(status).json({
    error: {
      message: error.message,
    },
  });

  //Respond to ourselves
  console.error(err);
});

app.listen(3000, () => {
  console.log(`App running on PORT 3000`);
});
