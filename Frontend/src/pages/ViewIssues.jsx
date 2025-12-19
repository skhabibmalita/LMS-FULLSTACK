import { useEffect, useState } from "react";
import axios from "axios";

function ViewIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/issues/transactions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">📚 Issued Books</h1>
        <p className="text-gray-400">Track all issued book transactions</p>
      </div>

      {issues.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-400 text-lg">No issued books records found</p>
        </div>
      ) : (
        <div className="card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold whitespace-nowrap">Book Title</th>
                  <th className="px-6 py-4 text-left text-white font-semibold whitespace-nowrap">Member Name</th>
                  <th className="px-6 py-4 text-left text-white font-semibold whitespace-nowrap">Issue Date</th>
                  <th className="px-6 py-4 text-left text-white font-semibold whitespace-nowrap">Due Date</th>
                  <th className="px-6 py-4 text-center text-white font-semibold whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {issues.map((issue, index) => (
                  <tr
                    key={issue._id}
                    className={`hover:bg-white/5 transition ${
                      index % 2 === 0 ? "bg-[#1e1e1e]" : "bg-[#252525]"
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-medium">{issue.bookId?.title || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-300">{issue.memberId?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(issue.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(issue.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          issue.status === "issued"
                            ? "bg-orange-500/20 text-orange-300"
                            : issue.status === "returned"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewIssues;
