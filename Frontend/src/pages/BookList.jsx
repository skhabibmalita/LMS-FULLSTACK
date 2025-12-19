import { useEffect, useState } from "react";
import axios from "axios";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    totalQuantity: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Books fetched:", res.data);
      setBooks(res.data);
      setError("");
    } catch (err) {
      console.error("❌ Error fetching books:", err);
      setError("Failed to load books: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (book) => {
    setEditingBook(book);
    setEditFormData({
      title: book.title,
      author: book.author,
      category: book.category || "",
      isbn: book.isbn || "",
      totalQuantity: book.totalQuantity
    });
    setShowEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingBook(null);
  };

  // Close on Escape key when modal open
  useEffect(() => {
    if (!showEditModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeEditModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showEditModal]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (showEditModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [showEditModal]);

  // Update Book
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    if (!editFormData.title || !editFormData.author || !editFormData.totalQuantity) {
      setError("Title, Author, and Quantity are required!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/books/${editingBook._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSuccess("✅ Book updated successfully!");
      closeEditModal();
      fetchBooks(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error updating book:", err);
      setError("Failed to update book: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete Book
  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/books/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSuccess("✅ Book deleted successfully!");
      fetchBooks(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error deleting book:", err);
      setError("Failed to delete book: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">📖 Books</h1>
        <p className="text-gray-400">Total Books: <span className="text-blue-400 font-bold">{books.length}</span></p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-4 rounded-lg mb-6 animate-pulse">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-lg mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Loading books...</p>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-[#1e1e1e] rounded-2xl p-12 text-center border border-gray-700">
          <p className="text-gray-400 text-lg">No books found. Add some books to get started!</p>
        </div>
      ) : (
        /* Books Table */
        <div className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-bold">Title</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Author</th>
                  <th className="px-6 py-4 text-left text-white font-bold">Category</th>
                  <th className="px-6 py-4 text-left text-white font-bold">ISBN</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Total</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Available</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {books.map((book, index) => (
                  <tr 
                    key={book._id} 
                    className={`hover:bg-[#2a2a2a] transition-colors ${
                      index % 2 === 0 ? "bg-[#1e1e1e]" : "bg-[#252525]"
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-medium">{book.title}</td>
                    <td className="px-6 py-4 text-gray-300">{book.author}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {book.category ? (
                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                          {book.category}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">{book.isbn || "N/A"}</td>
                    <td className="px-6 py-4 text-center text-white font-bold">{book.totalQuantity}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        book.availableQuantity > 0 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {book.availableQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(book)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book._id, book.title)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {books.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl font-bold text-white mb-1">{books.length}</div>
            <p className="text-blue-100">Total Books</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl font-bold text-white mb-1">
              {books.reduce((sum, b) => sum + b.availableQuantity, 0)}
            </div>
            <p className="text-green-100">Available Copies</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl font-bold text-white mb-1">
              {books.reduce((sum, b) => sum + (b.totalQuantity - b.availableQuantity), 0)}
            </div>
            <p className="text-orange-100">Issued Copies</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl font-bold text-white mb-1">
              {books.filter(b => b.availableQuantity === 0).length}
            </div>
            <p className="text-purple-100">Out of Stock</p>
          </div>
        </div>
      )}

      {/* Edit Modal - responsive modern card */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
          onClick={closeEditModal}
        >
          <div
            className="w-[92vw] sm:w-[420px] md:w-[560px] max-w-[560px] max-h-[85vh] bg-[#1e1e1e] border-r border-gray-700 shadow-2xl rounded-2xl sm:rounded-r-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Edit Book Drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-700 bg-[#1e1e1e]/95 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                ✏️ Edit Book
              </h2>
              <button
                onClick={closeEditModal}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                ✖
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleUpdateBook} className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    placeholder="Book title"
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Author *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.author}
                    onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                    placeholder="Author name"
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    placeholder="Fiction, Science, History, etc."
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">ISBN</label>
                  <input
                    type="text"
                    value={editFormData.isbn}
                    onChange={(e) => setEditFormData({ ...editFormData, isbn: e.target.value })}
                    placeholder="ISBN"
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Total Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.totalQuantity}
                    onChange={(e) => setEditFormData({ ...editFormData, totalQuantity: e.target.value })}
                    placeholder="Total quantity"
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 mt-6 px-5 sm:px-6 py-4 border-t border-gray-700 bg-[#1e1e1e]/95 backdrop-blur flex gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-1/2 px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
