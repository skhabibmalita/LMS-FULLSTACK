// models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type:String, required:true },
  author: { type:String },
  category: { type:String },
  isbn: { type:String, unique:true, sparse:true },
  totalQuantity: { type:Number, default:1 },
  availableQuantity: { type:Number, default:1 },
  addedDate: { type:Date, default:Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
