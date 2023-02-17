const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid

  const userExists = users.find((val) => {
    return val.username === username;
  });

  if (!userExists) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  if (!isValid(username)) {
    return false;
  } else {
    const user = users.find((val) => {
      return val.username === username;
    });

    if (user.password === password) {
      return true;
    } else {
      return false;
    }
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Please check your credentials" });
  } else {
    const token = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1h",
    });

    req.session.token = token;

    return res
      .status(200)
      .json({ message: "Authentication completed", token: token });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const { username } = req.session.user;
  const { isbn } = req.params;
  const { review } = req.query;
  review.toString();

  let reviews = books[isbn].reviews;

  reviews[username] = { review: review };

  return res.status(200).json({ message: "Review posted" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const { username } = req.session.user;
  const { isbn } = req.params;

  let reviews = books[isbn].reviews;

  if (!reviews[username]) {
    return res.status(404).json({ message: "That review dosent exists" });
  } else {
    delete reviews[username];
    return res.status(200).json({ message: "Review deleted" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
