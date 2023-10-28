const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  
});

// Get the book list available in the shop
public_users.get('/', function(req, res) {
    res.send(JSON.stringify(books));
});

// Using async/await
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/'); // Replace with your API endpoint
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book list' });
    }
  });

// Or, using Promise callbacks
public_users.get('/promise', (req, res) => {
    axios.get('https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/') // Replace with your API endpoint
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book list' });
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });

 public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`); // Replace with your API endpoint
      if (response.data) {
        res.json(response.data);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details' });
    }
  });
  
  // Or, using Promise callbacks
  public_users.get('/isbn/promise/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`) // Replace with your API endpoint
      .then(response => {
        if (response.data) {
          res.json(response.data);
        } else {
          res.status(404).json({ message: 'Book not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details' });
      });
  });
  

 const bookKeys = Object.keys(books);

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    const matchingBooks = [];

    for (const key of bookKeys) {
        const book = books[key];
        if (book.author === authorName) {
          matchingBooks.push(book);
        }
      }
    
      if (matchingBooks.length > 0) {
        // Author name matches, send the matching books as a response
        res.send(matchingBooks);
      } else {
        // Author name not found in the 'books' object, you can handle this case as needed
        res.status(404).send('Author not found');
      }
});

public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const response = await axios.get(`https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author?author=${author}`); // Replace with your API endpoint
      if (response.data) {
        res.json(response.data);
      } else {
        res.status(404).json({ message: 'Author not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details by author' });
    }
  });
  
  // Or, using Promise callbacks
  public_users.get('/author/promise/:author', (req, res) => {
    const author = req.params.author;
    axios.get(`https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author?author=${author}`) // Replace with your API endpoint
      .then(response => {
        if (response.data) {
          res.json(response.data);
        } else {
          res.status(404).json({ message: 'Author not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details by author' });
      });
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
    const matchingTitle = [];

    for (const key of bookKeys) {
        const book = books[key];
        if (book.title === titleName) {
          matchingTitle.push(book);
        }
      }
    
      if (matchingTitle.length > 0) {
        // Author name matches, send the matching books as a response
        res.send(matchingTitle);
      } else {
        // Author name not found in the 'books' object, you can handle this case as needed
        res.status(404).send('Author not found');
      }
});

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const response = await axios.get(`https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title?title=${title}`); // Replace with your API endpoint
      if (response.data) {
        res.json(response.data);
      } else {
        res.status(404).json({ message: 'Title not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details by title' });
    }
  });
  
  // Or, using Promise callbacks
  public_users.get('/title/promise/:title', (req, res) => {
    const title = req.params.title;
    axios.get(`https://grimjoe47-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title?title=${title}`) // Replace with your API endpoint
      .then(response => {
        if (response.data) {
          res.json(response.data);
        } else {
          res.status(404).json({ message: 'Title not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details by title' });
      });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

  // Check if the provided ISBN exists in the 'books' object
  if (books[isbn]) {
    // Check if the book has reviews
    if (books[isbn].reviews) {
      const reviews = books[isbn].reviews;
      res.send(reviews);
    } else {
      // No reviews found for the book
      res.status(404).send('No reviews found for this book.');
    }
  } else {
    // ISBN not found in the 'books' object
    res.status(404).send('Book with the provided ISBN not found.');
  }

});

module.exports.general = public_users;
