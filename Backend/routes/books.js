// routes/books.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const bookCtrl = require('../controllers/bookController');

// Get all books (public - for catalog)
router.get('/', bookCtrl.getBooks);

// Get a single book (public)
router.get('/:id', bookCtrl.getBook);

// Add a new book (auth required)
router.post('/', auth, bookCtrl.createBook);

// Update book (auth required)
router.put('/:id', auth, bookCtrl.updateBook);

// Delete book (auth required)
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
