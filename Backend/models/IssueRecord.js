// models/IssueRecord.js
const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  issueDate: { 
    type: Date, 
    default: Date.now 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  returnDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['issued', 'returned'], 
    default: 'issued' 
  },
  fineAmount: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('IssueRecord', IssueSchema);
