// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './pages/Sidebar';
import Header from './pages/Header';
import NotFound from './pages/NotFound';
import ProductCrud from './pages/ProductCrud';
import MemberCrud from './pages/MemberCrud';
import CategoryCrud from './pages/CategoryCrud';
import BorrowBook from './pages/BorrowBook';
import CostCrud from './pages/CostCrud';
import Home from './pages/Home';
import Report from './pages/Report';
import Donation from './pages/Donation';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import "./Style.css";
import Fees from './pages/Fees';
import FunctionalFees from './pages/FunctionalFees';
import FeeDetails from './pages/FeeDetails';
import FunctionalFeeDetails from './pages/FunctionalFeeDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to wait for auth status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(user ? true : false);
      setLoading(false); // Set loading to false once authentication state is checked
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth); // Firebase logout
    setIsLoggedIn(false); // Set loggedIn to false on manual logout
  };

  if (loading) return <div></div>; // Show loading while waiting for authentication state

  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        {isLoggedIn && <Header logout={logout} />}
        <div className="d-flex flex-grow-1" style={{ marginTop: isLoggedIn ? "85px" : "0" }}>
          {isLoggedIn && <Sidebar />}
          <main className={`flex-grow-1 p-3 overflow-auto ${isLoggedIn ? "" : "d-flex justify-content-center align-items-center"}`}
          style={{width:"80%"}}>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" /> : <LoginForm />}
              />
              <Route
                path="/signup"
                element={isLoggedIn ? <Navigate to="/" /> : <SignupForm />}
              />

              {/* Protected Routes */}
              {isLoggedIn ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/book-lists" element={<ProductCrud />} />
                  <Route path="/categories" element={<CategoryCrud />} />
                  <Route path="/borrow-books" element={<BorrowBook />} />
                  <Route path="/members" element={<MemberCrud />} />
                  <Route path="/fee-details" element={<FeeDetails />} />
                  <Route path="/fees" element={<Fees />} />
                  <Route path="/functional-fee-details" element={<FunctionalFeeDetails />} />
                  <Route path="/functional-fees" element={<FunctionalFees />} />
                  <Route path="/costs" element={<CostCrud />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/donation" element={<Donation />} />
                  <Route path="*" element={<NotFound />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
