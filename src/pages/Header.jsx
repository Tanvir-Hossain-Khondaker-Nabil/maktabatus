import React, { useEffect } from "react";
import $ from "jquery"; // Import jQuery
import { logoutUser } from "../authFunctions";
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


  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("Logged out successfully!");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <header>
      {/* <h1 className="h5 logo" >
          Maktabatus Salam
        </h1> */}
      <div className="row">
      <div className="col-6">
        <img src="https://i.ibb.co.com/G5cwFB3/IMG-20241202-213556.png" width={85} style={{marginLeft:"90px"}} />
      </div>

      <div className="col-6 d-flex align-items-center justify-content-end">
        <div className="dropdown position-relative">
          <button
            className="btn btn-sm dropdown-toggle d-flex align-items-center"
            type="button"
            id="profileDropdown"
            aria-expanded="false"
            style={{ color: "#09960e" }}
          >
            <div className="text-white gap-1 d-flex align-items-center">
              <img width="50" height="50" src="https://img.icons8.com/fluency/50/user-male-circle--v1.png" alt="user-male-circle--v1" />
              <p className="user-title d-none d-md-block">Tanvir Hossain Khondaker</p>
              {/*<i className="fa-solid fa-chevron-down"></i>*/}
            </div>
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end w-100"
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
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="fa-solid fa-sign-out-alt me-2"></i> Logout
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
