import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import AddMember from "./pages/AddMember";
import MemberList from "./pages/MemberList";
import IssueBook from "./pages/IssueBook";
import BookList from "./pages/BookList";
import ReturnBook from "./pages/ReturnBook";
import ViewIssues from "./pages/ViewIssues";
import Catalog from "./pages/Catalog";
import StudentDashboard from "./pages/StudentDashboard";
import CreateUser from "./pages/CreateUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <CreateUser />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AddBook />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <BookList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-member"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AddMember />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <MemberList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/issue-book"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <IssueBook />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/return"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ReturnBook />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ViewIssues />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route 
        path="/catalog"
        element={
            <Layout>
              <Catalog />
            </Layout>
        }
        />  

      </Routes>
    </BrowserRouter>
  );
}

export default App;
