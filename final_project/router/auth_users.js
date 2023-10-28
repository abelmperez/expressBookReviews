const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid request. Please provide both username and password" });
    }
  
    if (isValid(username) &&  authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
          accessToken,username
      }
      console.log("Access Token: " + accessToken + " Username: " + username);
      console.log("req.session.authorization: " + req.session.authorization);
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password 2"});
      }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get the current user's username from the session
  const username = req.session.authorization.username;

  // Get the ISBN from the route parameter
  const isbn = req.params.isbn;

  // Get the review from the request query
  const review = req.body.review;

  // Check if the user has already reviewed this book
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {}; // Initialize the reviews object if it doesn't exist
  }

  if (books[isbn].reviews[username]) {
    // Modify the existing review if it already exists
    books[isbn].reviews[username] = review;
    res.status(200).json({ message: "Review modified successfully" });
  } else {
    // Add a new review
    books[isbn].reviews[username] = review;
    res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Get the current user's username from the session
    const username = req.session.authorization.username;
  
    // Get the ISBN from the route parameter
    const isbn = req.params.isbn;
  
    // Check if the book with the given ISBN exists in the books database
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the book has reviews
    if (!books[isbn].reviews) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  
    // Check if the user has reviewed the book
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "User has not reviewed this book" });
    }
  
    // Delete the user's review for the book
    delete books[isbn].reviews[username];
    
    res.status(200).json({ message: "Review deleted successfully" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
