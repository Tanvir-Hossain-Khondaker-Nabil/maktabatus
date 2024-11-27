import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Header from "./pages/Header";
import NotFound from "./pages/NotFound";
import ProductCrud from "./pages/ProductCrud";
import MemberCrud from "./pages/MemberCrud";
import CategoryCrud from "./pages/CategoryCrud";
import BorrowBook from "./pages/BorrowBook";
import "./Style.css";
import Fees from "./pages/Fees";
import FeeDetails from "./pages/FeeDetails";

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <Header />
        <div className="d-flex flex-grow-1">
          <Sidebar />
          <main className="flex-grow-1 p-3 overflow-auto">
            <Routes>
              <Route path="/" element={<ProductCrud />} />
              <Route path="/categories" element={<CategoryCrud />} />
              <Route path="/borrow-books" element={<BorrowBook />} />
              <Route path="/members" element={<MemberCrud />} />
              <Route path="/fee-details" element={<FeeDetails/>} />
              <Route path="/fees" element={<Fees/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
