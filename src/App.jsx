import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Header from "./pages/Header";
import NotFound from "./pages/NotFound";
import ProductCrud from "./pages/ProductCrud";
import MemberCrud from "./pages/MemberCrud";
import CategoryCrud from "./pages/CategoryCrud";
import BorrowBook from "./pages/BorrowBook";
import CostCrud from "./pages/CostCrud";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Donation from "./pages/Donation";
import "./Style.css";
import Fees from "./pages/Fees";
import FunctionalFees from "./pages/FunctionalFees";
import FeeDetails from "./pages/FeeDetails";
import FunctionalFeeDetails from "./pages/FunctionalFeeDetails";

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <Header />
        <div className="d-flex flex-grow-1" style={{marginTop:"85px"}}>
          <Sidebar />
          <main className="flex-grow-1 p-3 overflow-auto" style={{width:"80%"}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book-lists" element={<ProductCrud />} />
              <Route path="/categories" element={<CategoryCrud />} />
              
              <Route path="/borrow-books" element={<BorrowBook />} />
              <Route path="/members" element={<MemberCrud />} />
              <Route path="/fee-details" element={<FeeDetails/>} />
              <Route path="/fees" element={<Fees/>} />

              <Route path="/functional-fee-details" element={<FunctionalFeeDetails/>} />
              <Route path="/functional-fees" element={<FunctionalFees/>} />
              <Route path="/costs" element={<CostCrud/>} />
              <Route path="/report" element={<Report/>} />
              <Route path="/donation" element={<Donation/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
