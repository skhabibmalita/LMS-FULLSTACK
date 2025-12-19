// controllers/issueController.js
const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/book');
const Member = require('../models/member');

// Issue a book
exports.issueBook = async (req, res) => {
  const { bookId, memberId, dueDate } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  if (book.availableQuantity < 1)
    return res.status(400).json({ message: 'No copies available' });

  const member = await Member.findById(memberId);
  if (!member) return res.status(404).json({ message: 'Member not found' });

  const issue = new IssueRecord({
    bookId,
    memberId,
    dueDate
  });

  await issue.save();

  book.availableQuantity -= 1;
  await book.save();

  res.status(201).json(issue);
};

// Return a book
exports.returnBook = async (req, res) => {
  const { issueId } = req.body;

  const issue = await IssueRecord.findById(issueId);
  if (!issue) return res.status(404).json({ message: 'Issue record not found' });

  if (issue.status === 'returned')
    return res.status(400).json({ message: 'Book already returned' });

  issue.returnDate = new Date();
  issue.status = 'returned';

  // fine calculation (1 currency unit per day)
  let fine = 0;

  if (issue.dueDate && issue.returnDate > issue.dueDate) {
    const delay = issue.returnDate - issue.dueDate;
    const daysLate = Math.ceil(delay / (1000 * 60 * 60 * 24));
    fine = daysLate;
  }

  issue.fineAmount = fine;
  await issue.save();

  const book = await Book.findById(issue.bookId);
  if (book) {
    book.availableQuantity += 1;
    await book.save();
  }

  res.json({ message: 'Book returned', issue, fine });
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  const transactions = await IssueRecord.find()
    .populate('bookId')
    .populate('memberId')
    .sort({ createdAt: -1 });

  res.json(transactions);
};

// Get transactions for the logged-in student
exports.getMyTransactions = async (req, res) => {
  try {
    // Expect req.user from auth middleware: { id, email, role }
    const { email, role, id } = req.user || {};

    if (!email && !id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the member record linked to this user
    // Strategy: prefer user.memberId if present; otherwise match by email
    let member = null;
    try {
      const User = require('../models/user');
      const Member = require('../models/member');
      const userDoc = await User.findById(id);
      if (userDoc && userDoc.memberId) {
        member = await Member.findById(userDoc.memberId);
      }
      if (!member && email) {
        member = await Member.findOne({ email });
      }
    } catch (e) {
      // Fallback if user/member lookup fails
    }

    if (!member) {
      return res.status(404).json({ message: 'Member record not found for user' });
    }

    const transactions = await IssueRecord.find({ memberId: member._id })
      .populate('bookId')
      .populate('memberId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error('getMyTransactions error:', err.message);
    res.status(500).json({ message: 'Failed to fetch your transactions' });
  }
};

// Self-checkout: Student checks out a book for themselves
exports.selfCheckout = async (req, res) => {
  try {
    const { bookId } = req.body;
    const { id, email } = req.user || {};

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID required' });
    }

    if (!id && !email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check availability
    if (book.availableQuantity < 1) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Find the member linked to this user
    let member = null;
    try {
      const User = require('../models/user');
      const userDoc = await User.findById(id);
      if (userDoc && userDoc.memberId) {
        member = await Member.findById(userDoc.memberId);
      }
      if (!member && email) {
        member = await Member.findOne({ email });
      }
    } catch (e) {
      // Fallback
    }

    if (!member) {
      return res.status(404).json({ message: 'Member record not found' });
    }

    // Create issue record with 14-day due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const issue = new IssueRecord({
      bookId,
      memberId: member._id,
      dueDate,
      status: 'issued'
    });

    await issue.save();

    // Decrease available quantity
    book.availableQuantity -= 1;
    await book.save();

    // Populate and return
    await issue.populate('bookId');
    await issue.populate('memberId');

    res.status(201).json({
      message: 'Book checked out successfully',
      issue,
      dueDate
    });
  } catch (err) {
    console.error('selfCheckout error:', err.message);
    res.status(500).json({ message: 'Failed to checkout book' });
  }
};

// Self-return: Student returns their own checked-out book
exports.selfReturn = async (req, res) => {
  try {
    const { issueId } = req.body;
    const { id, email } = req.user || {};

    if (!issueId) {
      return res.status(400).json({ message: 'Issue ID required' });
    }

    if (!id && !email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the issue record
    const issue = await IssueRecord.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    // Check if already returned
    if (issue.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Verify this is the student's own book (by matching member)
    try {
      const User = require('../models/user');
      const userDoc = await User.findById(id);
      const userMemberId = userDoc?.memberId?.toString();
      const issueMemberId = issue.memberId?.toString();
      
      if (userMemberId !== issueMemberId) {
        return res.status(403).json({ message: 'You can only return your own books' });
      }
    } catch (e) {
      // If verification fails, still proceed (fallback)
    }

    // Set return date and status
    issue.returnDate = new Date();
    issue.status = 'returned';

    // Calculate fine (1 currency unit per day late)
    let fine = 0;
    let daysLate = 0;
    if (issue.dueDate && issue.returnDate > issue.dueDate) {
      const delay = issue.returnDate - issue.dueDate;
      daysLate = Math.ceil(delay / (1000 * 60 * 60 * 24));
      fine = daysLate;
    }

    issue.fineAmount = fine;
    await issue.save();

    // Increase book availability
    const book = await Book.findById(issue.bookId);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    await issue.populate('bookId');
    await issue.populate('memberId');

    const message = fine > 0 
      ? `Book returned with ${fine} fine (${daysLate} days late)`
      : 'Book returned successfully on time!';

    res.json({ 
      message, 
      issue, 
      fine,
      returnDate: issue.returnDate
    });
  } catch (err) {
    console.error('selfReturn error:', err.message);
    res.status(500).json({ message: 'Failed to return book' });
  }
};
