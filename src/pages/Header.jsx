import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation on logout
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Import Firebase auth for logout

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the dropdown menu
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setDropdownOpen(!dropdownOpen);
  };

  // Close the dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownOpen && !e.target.closest('.dropdown')) {
      setDropdownOpen(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Add event listener for clicks outside the dropdown
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header>
      <div className="row">
        <div className="col-6">
          <img
            src="https://i.ibb.co.com/G5cwFB3/IMG-20241202-213556.png"
            width={85}
            style={{ marginLeft: "90px" }}
            alt="Logo"
          />
        </div>

        <div className="col-6 d-flex align-items-center justify-content-end">
          <div className="dropdown position-relative">
            <button
              className="btn btn-sm dropdown-toggle d-flex align-items-center"
              type="button"
              id="profileDropdown"
              aria-expanded={dropdownOpen ? "true" : "false"}
              onClick={toggleDropdown}
              style={{ color: "#09960e" }}
            >
              <div className="text-white gap-1 d-flex align-items-center">
                <img
                  width="46"
                  height="46"
                  src="https://img.icons8.com/fluency/46/user-male-circle--v1.png"
                  alt="user-male-circle"
                />
                <p className="user-title d-none d-md-block">Maktabatus Salam</p>
              </div>
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-end shadow-lg rounded-3 border-0 ${dropdownOpen ? 'show' : ''}`}
              style={{ minWidth: "200px", background: "#fff" }}
              aria-labelledby="profileDropdown"
            >
              <li>
                <a className="dropdown-item d-flex align-items-center py-2" href="/profile">
                  <i className="fa-solid fa-user me-2 text-primary"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center py-2" href="/settings">
                  <i className="fa-solid fa-gear me-2 text-secondary"></i>
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center py-2 text-danger"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-solid fa-sign-out-alt me-2"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>

          </div>
        </div>
      </div>

      {/* Profile Dropdown */}

      {/* Additional Styling */}
      <style jsx>{`
        header {
          background-color: #f8f9fa;
        }
        .dropdown-menu {
          min-width: 200px;
        }
      `}</style>
    </header>
  );
};

export default Header;
