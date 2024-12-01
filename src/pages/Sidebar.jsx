import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="d-none d-md-flex flex-column bg-light shadow-sm" style={{width:"20%"}}>
      <nav className="flex-grow-1">
        <ul className="nav flex-column px-3">
          <li className="nav-item mb-3">
            <Link
              to="/dashboard"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/dashboard") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-house me-2 ${
                  isActive("/dashboard") ? "text-white" : ""
                }`}
              ></i>
              Home
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/book-lists"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/book-lists") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-book-bookmark ${
                  isActive("/book-lists") ? "text-white" : ""
                }`}
              ></i> &nbsp; Book List
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/borrow-books"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/borrow-books") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-book me-2 ${
                  isActive("/borrow-books") ? "text-white" : ""
                }`}
              ></i>
              Borrow Books
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/categories"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/categories") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-tags me-2 ${
                  isActive("/categories") ? "text-white" : ""
                }`}
              ></i>
              Categories
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/members"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/members") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-users me-2 ${
                  isActive("/members") ? "text-white" : ""
                }`}
              ></i>
              Members
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/fees"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/fees") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-piggy-bank me-2 ${
                  isActive("/fees") ? "text-white" : ""
                }`}
              ></i>
              Fees
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/functional-fees"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/functional-fees") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-piggy-bank me-2 ${
                  isActive("/functional-fees") ? "text-white" : ""
                }`}
              ></i>
              Functional Fees
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/costs"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/costs") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-comments-dollar me-2 ${
                  isActive("/costs") ? "text-white" : ""
                }`}
              ></i>
              Cost
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/donation"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/donation") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-hand-holding-dollar me-2 ${
                  isActive("/donation") ? "text-white" : ""
                }`}
              ></i>
              Donation
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/report"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/report") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i
                className={`fa-solid fa-file-lines me-2 ${
                  isActive("/report") ? "text-white" : ""
                }`}
              ></i>
              Report
            </Link>
          </li>
          
        </ul>
      </nav>


      {/* Additional Styling */}
      <style jsx>{`
        aside {
          width: 260px;;
        }
        .nav-link:hover {
          color: #09960e !important;
          background-color: #e9ecef;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .bg-success {
          background: #09960e !important;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
