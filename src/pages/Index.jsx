import React from 'react';

function Index() {
    return (
        <div>
            {/* Header Section */}
            <header className="header">
                <div className="logo">মাকতাবাতুস সালাম</div>

                <div className="right-section">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <span>CALL US: + 01825 77 347</span>
                        <span>|</span>
                        <span>admin@gmail.com</span>
                    </div>

                    {/* Social Icons */}
                    <div className="social-icons">
                        <a href="#" className="text-decoration-none">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#" className="text-decoration-none">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                        <a href="#" className="text-decoration-none">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>
            </header>

            {/* Navigation Bar */}
            <nav>
                <div className="container">
                    <ul className="nav nav-pills justify-content-center gap-4">
                        <li className="nav-item">
                            <a href="#" className="nav-link">HOME</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">ACCOUNT</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">PAYMENT</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">MESSAGE</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">ABOUT</a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">CONTACT US</a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section position-relative">
                <img
                    src="https://i0.wp.com/www.muslimmedia.info/wp-content/uploads/2020/09/44540.jpg?fit=1400%2C700&ssl=1"
                    className="img-fluid w-100"
                    alt="Bookshelf Background"
                />
                <div
                    className="position-absolute top-50 start-50 translate-middle text-center text-white"
                    style={{
                        width: '1000px',
                        height: '250px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '40px 60px 30px 60px',
                    }}
                >
                    <h2 className="fw-bold">
                        "পাঠ করুন আপনার পালনকর্তার নামে যিনি সৃষ্টি করেছেন।"
                    </h2>
                    <p>
                        বলা হয়েছে, “সৃষ্টি করেছেন” কাকে সৃষ্টি করেছেন তা বলা হয়নি। এ
                        থেকে আপনা-আপনিই এ অর্থ বের হয়ে আসে, সেই রবের নাম নিয়ে পড় যিনি
                        স্রষ্টা সমগ্র বিশ্ব-জাহানের, সমগ্র সৃষ্টিজগতের।
                    </p>
                    <button className="btn btn-warning fw-bold">MEMBERSHIP</button>
                </div>
            </section>

            {/* Features Section */}
            <section className="features bg-light py-5">
                <div className="container">
                    <div className="row text-center">
                        {/* Feature 1 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 shadow-sm rounded">
                                <i className="fas fa-book-reader fa-3x text-warning"></i>
                                <h5 className="fw-bold mt-3">জ্ঞান অর্জন করা</h5>
                                <p>
                                    জ্ঞান অর্জন প্রত্যেক মুসলমানের জন্য বাধ্যতামূলক এবং কোন একটি
                                    বিশেষ শ্রেণী বা উপশ্রেণী।
                                </p>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 shadow-sm rounded">
                                <i className="fas fa-hand-holding-heart fa-3x text-warning"></i>
                                <h5 className="fw-bold mt-3">রবকে চেনা</h5>
                                <p>
                                    রবকে চেনা প্রত্যেক মুসলমানের জন্য বাধ্যতামূলক এবং কোন একটি
                                    বিশেষ শ্রেণী বা উপশ্রেণী।
                                </p>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 shadow-sm rounded">
                                <i className="fas fa-mosque fa-3x text-warning"></i>
                                <h5 className="fw-bold mt-3">দ্বীনের পথচলা</h5>
                                <p>
                                    দ্বীনের পথচলা প্রত্যেক মুসলমানের জন্য বাধ্যতামূলক এবং কোন একটি
                                    বিশেষ শ্রেণী বা উপশ্রেণী।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Book List Section */}
            <section className="book-list py-5" style={{ backgroundColor: '#89b2ac' }}>
                <div className="container">
                    {/* Section Title */}
                    <h2 className="text-center text-white fw-bold mb-5">Book List</h2>
                    {/* Book Grid */}
                    <div className="row g-4">
                        {/* Single Book Card */}
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="card h-100 text-center border-0 shadow" style={{ backgroundColor: '#d9f0ee' }}>
                                <img
                                    src="https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Obaddhotar_Itihas-Dr_Shamsul_Arafin-af2a4-225604.jpg"
                                    className="card-img-top img-fluid"
                                    alt="Book Image"
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">গল্পগুলো অন্যরকম</h5>
                                    <p className="card-text">প্রকাশনী: সঞ্চলন প্রকাশন</p>
                                </div>
                            </div>
                        </div>

                        {/* Repeat for other books */}
                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="card h-100 text-center border-0 shadow" style={{ backgroundColor: '#d9f0ee' }}>
                                <img
                                    src="https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Obaddhotar_Itihas-Dr_Shamsul_Arafin-af2a4-225604.jpg"
                                    className="card-img-top img-fluid"
                                    alt="Book Image"
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">মা, মা, মা ও বাবা</h5>
                                    <p className="card-text">প্রকাশনী: সঞ্চলন প্রকাশন</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="card h-100 text-center border-0 shadow" style={{ backgroundColor: '#d9f0ee' }}>
                                <img
                                    src="https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Obaddhotar_Itihas-Dr_Shamsul_Arafin-af2a4-225604.jpg"
                                    className="card-img-top img-fluid"
                                    alt="Book Image"
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">প্যারাডক্সিকাল সাজিদ</h5>
                                    <p className="card-text">প্রকাশনী: সঞ্চলন প্রকাশন</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-4 col-sm-6">
                            <div className="card h-100 text-center border-0 shadow" style={{ backgroundColor: '#d9f0ee' }}>
                                <img
                                    src="https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Obaddhotar_Itihas-Dr_Shamsul_Arafin-af2a4-225604.jpg"
                                    className="card-img-top img-fluid"
                                    alt="Book Image"
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">প্যারাডক্সিকাল সাজিদ</h5>
                                    <p className="card-text">প্রকাশনী: সঞ্চলন প্রকাশন</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section (optional) */}
            <footer className="text-center py-3 bg-dark text-white">
                <p>© 2024 All Rights Reserved. মাকতাবাতুস সালাম</p>
            </footer>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                    body {
                    font-family: 'Poppins', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                    }

                    p{
                    margin: 0;
                    padding: 0;
                    }
                    /* Header Section */
                    .header {
                    background: linear-gradient(135deg, #343a40 0%, #495057 100%);
                    padding: 20px 0;
                    color: #fff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }

                    .header .logo {
                    font-size: 36px;
                    font-weight: 700;
                    color: #ffc107;
                    margin-left: 30px;
                    }

                    .header .right-section {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    margin-right: 30px;
                    }

                    .header .contact-info {
                    font-size: 16px;
                    color: #ccc;
                    margin-right: 20px;
                    }

                    .header .contact-info span {
                    margin-right: 15px;
                    }

                    .header .social-icons {
                    display: flex;
                    }

                    .header .social-icons a {
                    color: #ffc107;
                    margin-left: 15px;
                    font-size: 25px;
                    transition: color 0.3s ease;
                    }

                    .header .social-icons a:hover {
                    color: #fd7e14;
                    /* Hover effect */
                    }

                    /* Media Query for Mobile */
                    @media (max-width: 768px) {
                    .header {
                        padding: 20px 15px;
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .header .logo {
                        font-size: 28px;
                        margin-bottom: 10px;
                    }

                    .header .right-section {
                        width: 100%;
                        justify-content: flex-start;
                        margin-right: 0;
                        margin-top: 10px;
                    }

                    .header .contact-info {
                        font-size: 14px;
                        margin-right: 10px;
                        margin-top: 5px;
                    }

                    .header .social-icons {
                        margin-left: 20px;
                    }

                    .header .social-icons a {
                        font-size: 20px;
                        margin-left: 12px;
                    }
                    }


                    /* Navigation Bar */
                    nav {
                    background-color: #ffc107;
                    /* Blue color for navigation */
                    padding: 6px 0;
                    }

                    .nav-pills .nav-link {
                    color: #343a40;
                    font-weight: 500;
                    transition: background-color 0.3s ease;
                    }

                    /* styles.css */
                    .hero-section img {
                    height: 430px;
                    object-fit: cover;
                    }

                    .hero-section .position-absolute {
                    background: rgba(0, 0, 0, 0.5);
                    padding: 20px;
                    border-radius: 10px;
                    }

                    .feature-card {
                    background-color: #1c1c1c;
                    color: #fff;
                    }

                    .feature-card i {
                    display: block;
                    margin-bottom: 10px;
                    }

                    @media (max-width: 768px) {


                    /* Navigation Bar */
                    nav {
                        padding: 10px 0;
                    }

                    .nav-pills .nav-link {
                        font-size: 14px;
                        padding: 8px 16px;
                    }

                    .nav-pills .nav-link.active {
                        background-color: #fd7e14;
                    }

                    /* Hero Section */
                    .hero-section {
                        height: 350px;
                    }

                    .hero-section .content h2 {
                        font-size: 24px;
                        line-height: 1.3;
                    }

                    .hero-section .content p {
                        font-size: 14px;
                        margin-top: 10px;
                    }

                    .hero-section button {
                        padding: 10px 25px;
                        font-size: 16px;
                    }

                    /* Features Section */
                    .features {
                        padding: 40px 15px;
                    }

                    .feature-card {
                        padding: 20px;
                    }

                    .feature-card i {
                        font-size: 35px;
                    }

                    .feature-card h5 {
                        font-size: 20px;
                    }

                    .feature-card p {
                        font-size: 14px;
                    }

                    /* Adjust feature card layout for smaller screens */
                    .feature-card {
                        margin-bottom: 20px;
                    }

                    /* Make the columns stack on smaller screens */
                    .row .col-md-4 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }

                    /* Social Icons in the header stacked */
                    .header .social-icons {
                        margin-top: 15px;
                    }

                    .header .social-icons a {
                        margin-right: 10px;
                    }
                    }




                    .book-list h2 {
                    font-size: 36px;
                    text-shadow: 2px 2px 4px #000;
                    }

                    .book-list .card img {
                    height: 250px;
                    object-fit: cover;
                    border-radius: 8px;
                    }

                    .book-list .card-body h5 {
                    font-size: 18px;
                    color: #004d40;
                    }

                    .book-list .card-body p {
                    font-size: 14px;
                    color: #666;
                    }

                    @media (max-width: 576px) {
                    .book-list h2 {
                        font-size: 28px;
                    }
                }`}
            </style>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
        </div>
    );
}

export default Index;
