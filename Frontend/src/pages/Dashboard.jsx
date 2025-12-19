import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalMembers: 0,
    overdueBooks: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">📊 Dashboard</h1>
        <p className="text-gray-400">Welcome to Library Management System</p>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Stats Cards */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-16 h-16 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
            {/* Inner pulsing dot */}
          </div>
        </div>
      )}
      {!loading && <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-10 xl:gap-12">
        {/* Total Books */}
        <div className="card p-5 sm:p-6 transition-transform hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📚</span>
            <span className="text-gray-300 text-sm font-medium">Total</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalBooks}</h3>
          <p className="text-gray-400 text-sm">Total Books</p>
        </div>

        {/* Available Books */}
        <div className="card p-5 sm:p-6 transition-transform hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">✅</span>
            <span className="text-gray-300 text-sm font-medium">Available</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.availableBooks}</h3>
          <p className="text-gray-400 text-sm">Available Copies</p>
        </div>

        {/* Issued Books */}
        <div className="card p-5 sm:p-6 transition-transform hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📤</span>
            <span className="text-gray-300 text-sm font-medium">Issued</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.issuedBooks}</h3>
          <p className="text-gray-400 text-sm">Books Issued</p>
        </div>

        {/* Total Members */}
        <div className="card p-5 sm:p-6 transition-transform hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">👥</span>
            <span className="text-gray-300 text-sm font-medium">Members</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalMembers}</h3>
          <p className="text-gray-400 text-sm">Total Members</p>
        </div>

        {/* Overdue Books */}
        <div className="card p-5 sm:p-6 transition-transform hover:-translate-y-0.5 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">⚠️</span>
            <span className="text-gray-300 text-sm font-medium">Overdue</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.overdueBooks}</h3>
          <p className="text-gray-400 text-sm">Books Overdue</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card p-5 sm:p-6 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📋</span> Recent Transactions
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400">Loading recent transactions…</div>
        ) : stats.recentTransactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recent transactions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b border-gray-700/60">
                  <th className="text-left py-3 px-3 sm:px-4 text-gray-400 font-medium whitespace-nowrap">Book</th>
                  <th className="text-left py-3 px-3 sm:px-4 text-gray-400 font-medium whitespace-nowrap">Member</th>
                  <th className="text-left py-3 px-3 sm:px-4 text-gray-400 font-medium whitespace-nowrap">Issue Date</th>
                  <th className="text-left py-3 px-3 sm:px-4 text-gray-400 font-medium whitespace-nowrap">Due Date</th>
                  <th className="text-left py-3 px-3 sm:px-4 text-gray-400 font-medium whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b border-gray-800/60 hover:bg-white/5 transition">
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">{transaction.bookId?.title || 'N/A'}</td>
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">{transaction.memberId?.name || 'N/A'}</td>
                    <td className="py-3 px-3 sm:px-4 text-gray-300 whitespace-nowrap">
                      {new Date(transaction.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-gray-300 whitespace-nowrap">
                      {new Date(transaction.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className={`badge ${
                        transaction.status === 'issued' 
                          ? 'bg-orange-500/20 text-orange-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>}
    </div>
  );
}

export default Dashboard;
