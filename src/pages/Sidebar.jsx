import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="d-flex flex-column bg-light shadow-sm">
      <nav className="flex-grow-1">
        <ul className="nav flex-column px-3">
          <li className="nav-item mb-3">
            <Link
              to="/"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i className="fa-solid fa-house me-2"></i> Home
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/borrow-books"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/borrow-books") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i className="fa-solid fa-book me-2"></i> Borrow Books
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/categories"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/categories") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i className="fa-solid fa-tags me-2"></i> Categories
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/members"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/members") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i className="fa-solid fa-users me-2"></i> Members
            </Link>
          </li>
          <li className="nav-item mb-3">
            <Link
              to="/fees"
              className={`d-flex align-items-center px-3 py-2 ${
                isActive("/fees") ? "text-white bg-custom-hard shadow-sm" : "text-secondary"
              }`}
            >
              <i class="fa-solid fa-piggy-bank me-2"></i>Fees
            </Link>
          </li>
        </ul>
      </nav>


      {/* Additional Styling */}
      <style jsx>{`
        aside {
          width: 300px;
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
