import { useEffect, useState } from "react";
import axios from "axios";

function IssuedBooks() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/issues/transactions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issued books", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📘 Issued Books</h2>
      

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Book</th>
            <th>Member</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td>{issue.bookId?.title}</td>
              <td>{issue.memberId?.name}</td>
              <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
              <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
              <td>{issue.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




export default IssuedBooks;
