// controllers/dashboardController.js
const Book = require('../models/book');
const Member = require('../models/member');
const IssueRecord = require('../models/IssueRecord');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total books count
    const totalBooks = await Book.countDocuments();
    
    // Total available books (sum of all availableQuantity)
    const booksData = await Book.find();
    const availableBooks = booksData.reduce((sum, book) => sum + book.availableQuantity, 0);
    
    // Total issued books (with status 'issued')
    const issuedBooks = await IssueRecord.countDocuments({ status: 'issued' });
    
    // Total members
    const totalMembers = await Member.countDocuments();
    
    // Overdue books (issued books past due date)
    const today = new Date();
    const overdueBooks = await IssueRecord.countDocuments({
      status: 'issued',
      dueDate: { $lt: today }
    });
    
    // Recent transactions (last 5)
    const recentTransactions = await IssueRecord.find()
      .populate('bookId', 'title')
      .populate('memberId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalBooks,
      availableBooks,
      issuedBooks,
      totalMembers,
      overdueBooks,
      recentTransactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
