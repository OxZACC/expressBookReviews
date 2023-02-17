const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const booksList = Object.values(books);

public_users.post("/register", (req, res) => {
  //Write your code here

  const { username, password } = req.body;

  const userExists = users.find((val) => {
    return val.username === username;
  });

  if (!userExists) {
    users.push({ username, password });

    return res
      .status(200)
      .json({ message: "The user " + username + " has been registered" });
  } else {
    return res
      .status(403)
      .json({ message: "The user " + username + " already exists" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here

  const { isbn } = req.params;

  return res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { author } = req.params;

  const booksFound = booksList.filter((val) => {
    return val.author === author;
  });

  if (!booksFound) {
    return res
      .status(404)
      .json({ message: "There is no books from that author" + author });
  } else {
    return res.status(200).json(booksFound);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here

  const { title } = req.params;

  const booksFound = booksList.filter((val) => {
    return val.title === title;
  });

  if (!booksFound) {
    return res
      .status(404)
      .json({ message: "There is no books from that title" + title });
  } else {
    return res.status(200).json(booksFound);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here

  const { isbn } = req.params;

  if (books[isbn].reviews === {}) {
    return res
      .status(404)
      .json({ message: "This book" + books[isbn] + "has no reviews" });
  } else {
    return res.status(200).json(books[isbn].reviews);
  }
});

module.exports.general = public_users;
