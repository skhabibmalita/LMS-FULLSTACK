// controllers/bookController.js
const Book = require('../models/book');

// Get all books
exports.getBooks = async (req, res) => {
  try {
    console.log("📖 Fetching all books...");
    const books = await Book.find().sort({ addedDate: -1 });
    console.log("✅ Books fetched:", books.length, "books found");
    res.json(books);
  } catch (err) {
    console.error("❌ Error fetching books:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get a single book
exports.getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book)
    return res.status(404).json({ message: 'Book not found' });

  res.json(book);
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, category, isbn, totalQuantity } = req.body;

    console.log("📚 Adding book:", { title, author, category, isbn, totalQuantity });

    const newBook = new Book({
      title,
      author,
      category,
      isbn,
      totalQuantity: totalQuantity || 1,
      availableQuantity: totalQuantity || 1
    });

    await newBook.save();
    console.log("✅ Book saved:", newBook);
    res.status(201).json(newBook);
  } catch (err) {
    console.error("❌ Error adding book:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook)
      return res.status(404).json({ message: 'Book not found' });

    console.log("✅ Book updated:", updatedBook);
    res.json(updatedBook);
  } catch (err) {
    console.error("❌ Error updating book:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook)
      return res.status(404).json({ message: 'Book not found' });

    console.log("✅ Book deleted:", deletedBook);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting book:", err.message);
    res.status(500).json({ message: err.message });
  }
};
