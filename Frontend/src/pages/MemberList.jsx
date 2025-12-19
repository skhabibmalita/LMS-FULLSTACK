import { useEffect, useState } from "react";
import axios from "axios";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [query, setQuery] = useState("");
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/members", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Members fetched:", res.data);
      setMembers(res.data);
      setError("");
    } catch (err) {
      console.error("❌ Error fetching members:", err);
      setError("Failed to load members: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (member) => {
    setEditingMember(member);
    setEditFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      address: member.address || ""
    });
    setShowEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingMember(null);
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

  // Update Member
  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/members/${editingMember._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSuccess("✅ Member updated successfully!");
      closeEditModal();
      fetchMembers(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error updating member:", err);
      setError("Failed to update member: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete Member
  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to delete "${memberName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSuccess("✅ Member deleted successfully!");
      fetchMembers(); // Refresh list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error deleting member:", err);
      setError("Failed to delete member: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">👥 Members</h1>
        <p className="text-gray-400">Total Members: <span className="text-blue-400 font-bold">{members.length}</span></p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-96 px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
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
            <p className="text-gray-400">Loading members...</p>
          </div>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-[#1e1e1e] rounded-2xl p-12 text-center border border-gray-700">
          <p className="text-gray-400 text-lg">No members found. Add some members to get started!</p>
        </div>
      ) : (
        /* Members Table */
        <div className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-2 py-2 text-left text-white font-semibold text-xs whitespace-nowrap">Name</th>
                  <th className="px-2 py-2 text-left text-white font-semibold text-xs whitespace-nowrap">Email</th>
                  <th className="px-2 py-2 text-left text-white font-semibold text-xs whitespace-nowrap">Phone</th>
                  <th className="px-2 py-2 text-left text-white font-semibold text-xs whitespace-nowrap">Address</th>
                  <th className="px-2 py-2 text-left text-white font-semibold text-xs whitespace-nowrap">Joined</th>
                  <th className="px-2 py-2 text-center text-white font-semibold text-xs whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {members
                  .filter((m) => {
                    const q = query.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (m.name || "").toLowerCase().includes(q) ||
                      (m.email || "").toLowerCase().includes(q) ||
                      (m.phone || "").toLowerCase().includes(q)
                    );
                  })
                  .map((member, index) => (
                  <tr 
                    key={member._id} 
                    className={`hover:bg-[#2a2a2a] transition-colors ${
                      index % 2 === 0 ? "bg-[#1e1e1e]" : "bg-[#252525]"
                    }`}
                  >
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-[10px]">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium text-xs">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap text-xs">{member.email}</td>
                    <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap text-xs">{member.phone || "N/A"}</td>
                    <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap text-xs">{member.address || "N/A"}</td>
                    <td className="px-2 py-1.5 text-gray-400 text-[10px] whitespace-nowrap">
                      {new Date(member.membershipDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => openEditModal(member)}
                          className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-medium transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member._id, member.name)}
                          className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-medium transition"
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
      {members.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl font-bold text-white mb-1">{members.length}</div>
            <p className="text-blue-100">Total Members</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl font-bold text-white mb-1">
              {members.filter(m => m.email).length}
            </div>
            <p className="text-green-100">With Email</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl font-bold text-white mb-1">
              {members.filter(m => m.phone).length}
            </div>
            <p className="text-purple-100">With Phone</p>
          </div>
        </div>
      )}

      {/* Edit Modal - responsive modern card */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-start bg-black/60 backdrop-blur-sm p-4 sm:p-6"
          onClick={closeEditModal}
        >
          <div
            className="w-[92vw] sm:w-[420px] md:w-[560px] max-w-[560px] max-h-[85vh] bg-[#1e1e1e] border-r border-gray-700 shadow-2xl rounded-2xl sm:rounded-r-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Edit Member Drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-700 bg-[#1e1e1e]/95 backdrop-blur">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                ✏️ Edit Member
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
            <form onSubmit={handleUpdateMember} className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full px-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Address</label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    rows="3"
                    placeholder="Address"
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

export default MemberList;
