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
public_users.get("/", async function (req, res) {
  let findBooks = new Promise((myResolve) => {
    let value = [];

    setTimeout(() => {
      value = books;

      return myResolve(value);
    }, 3000);
  });

  const value = await findBooks;

  return res.status(200).json(value);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here

  const { isbn } = req.params;

  let findBook = new Promise((myResolve) => {
    setTimeout(() => {
      value = books[isbn];

      return myResolve(value);
    }, 3000);
  });

  findBook.then((value) => {
    return res.status(200).json(value);
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { author } = req.params;

  let findBook = new Promise((myResolve, myReject) => {
    setTimeout(() => {
      const booksFound = booksList.filter((val) => {
        return val.author === author;
      });

      if (!booksFound) {
        return myReject(
          (error = "There is no books from that author" + author)
        );
      } else {
        return myResolve(booksFound);
      }
    }, 3000);
  });

  findBook
    .then((value) => {
      return res.status(200).json(value);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here

  const { title } = req.params;

  let findBook = new Promise((myResolve, myReject) => {
    setTimeout(() => {
      const booksFound = booksList.filter((val) => {
        return val.title === title;
      });

      if (!booksFound) {
        return myReject((error = "There is no books from that title" + title));
      } else {
        return myResolve(booksFound);
      }
    }, 3000);
  });

  findBook
    .then((value) => {
      return res.status(200).json(value);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
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
