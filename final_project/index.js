const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const books = require("./router/booksdb.js");

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) {
    res.status(403).json("Your credentials are missing");
  } else {
    const token = header.split(" ")[1];

    if (!token || token !== req.session.token) {
      res.status(403).json("Your credentials are missing");
    }

    const user = jwt.verify(token, "fingerprint_customer", { complete: true });

    req.session.user = user.payload;

    next();
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
