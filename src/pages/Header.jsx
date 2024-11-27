import React, { useEffect } from "react";
import $ from "jquery"; // Import jQuery

const Header = () => {
  // Dropdown toggle logic using jQuery
  useEffect(() => {
    // Initialize jQuery for dropdown toggle and clicking outside
    const $dropdownToggle = $('#profileDropdown');
    const $dropdownMenu = $('.dropdown-menu');

    // Toggle the dropdown menu when the button is clicked
    $dropdownToggle.on('click', function (e) {
      e.stopPropagation(); // Prevent the event from bubbling up
      $dropdownMenu.toggleClass('show');
    });

    // Close dropdown if clicked outside
    $(document).on('click', function (e) {
      if (!$dropdownMenu.is(e.target) && !$dropdownToggle.is(e.target) && $dropdownMenu.hasClass('show')) {
        $dropdownMenu.removeClass('show');
      }
    });

    // Cleanup event listeners when component unmounts
    return () => {
      $dropdownToggle.off('click');
      $(document).off('click');
    };
  }, []);

  return (
    <header className="d-flex align-items-center justify-content-between px-4 py-3 shadow-sm bg-white">
      {/* Logo / Title */}
      <h1 className="h5 fw-bold" style={{ color: "#09960e", fontSize: "25px" }}>
        Maktabatus Salam
      </h1>

      {/* Profile Dropdown */}
      <div className="dropdown position-relative">
        <button
          className="btn btn-sm dropdown-toggle d-flex align-items-center"
          type="button"
          id="profileDropdown"
          aria-expanded="false"
          style={{ color: "#09960e" }}
        >
          <i className="fa-solid fa-user-circle fs-5 me-2"></i> Profile
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="profileDropdown"
        >
          <li>
            <a className="dropdown-item" href="/profile">
              <i className="fa-solid fa-user me-2"></i> My Profile
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="/settings">
              <i className="fa-solid fa-gear me-2"></i> Settings
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button className="dropdown-item text-danger">
              <i className="fa-solid fa-sign-out-alt me-2"></i> Logout
            </button>
          </li>
        </ul>
      </div>

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
