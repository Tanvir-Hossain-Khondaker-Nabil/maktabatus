
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';


const Home = () => {
  const [membersCount, setMembersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [borrowedProductsCount, setBorrowedProductsCount] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [totalFunctionalFees, setTotalFunctionalFees] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0); // Added donations state
  const [currentValue, setCurrentValue] = useState(0); // Added current value state

  useEffect(() => {
    // Fetch members count
    const fetchMembersCount = async () => {
      const snapshot = await getDocs(collection(db, 'members'));
      setMembersCount(snapshot.size);
    };

    // Fetch products count
    const fetchProductsCount = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const totalQuantity = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return Number(acc) + Number((data.quantity || 0)); // Add the quantity if it exists, default to 0
      }, 0);
      setProductsCount(totalQuantity);
    };
    

    // Fetch borrowed products count
    const fetchBorrowedProductsCount = async () => {
      const snapshot = await getDocs(collection(db, 'borrowedProducts'));
      setBorrowedProductsCount(snapshot.size);
    };

    // Fetch total fees sum
    const fetchTotalFees = async () => {
      const snapshot = await getDocs(collection(db, 'fees'));
      const total = snapshot.docs.reduce((acc, doc) => Number(acc) + Number(doc.data().amount), 0);
      setTotalFees(total);
    };

    const fetchTotalFunctionalFees = async () => {
      const snapshot = await getDocs(collection(db, 'functional_fees'));
      const total = snapshot.docs.reduce((acc, doc) => Number(acc) + Number(doc.data().amount), 0);
      setTotalFunctionalFees(total);
    };

    // Fetch total costs sum
    const fetchTotalCosts = async () => {
      const snapshot = await getDocs(collection(db, 'costs'));
      const total = snapshot.docs.reduce((acc, doc) => Number(acc) + Number(doc.data().amount), 0);
      setTotalCosts(total);
    };

    // Fetch total donations sum
    const fetchTotalDonations = async () => {
      const snapshot = await getDocs(collection(db, 'donations'));
      const total = snapshot.docs.reduce((acc, doc) => Number(acc) + Number(doc.data().amount), 0);
      setTotalDonations(total);
    };

    // Calculate current value
    const calculateCurrentValue = () => {
      const current = totalFees + totalFunctionalFees + totalDonations - totalCosts;
      setCurrentValue(current);
    };

    fetchMembersCount();
    fetchProductsCount();
    fetchBorrowedProductsCount();
    fetchTotalFees();
    fetchTotalCosts();
    fetchTotalFunctionalFees();
    fetchTotalDonations();

    // Calculate the current value after all data is fetched
    calculateCurrentValue();
  }, [totalFees, totalFunctionalFees, totalDonations, totalCosts]); // Adding dependencies to recalculate when these values change

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Deshboard</h2>
        <div className="row mt-2">
          <div className="col-md-4">
            <div className="custom-card primary-bg mb-4">
              <div className="custom-card-header text-center">
                <h6>Total Members</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{membersCount} persons</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card mb-4">
              <div className="custom-card-header text-center">
                <h6>Total Books</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{productsCount} items</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card warning-bg mb-4">
              <div className="custom-card-header text-center">
                <h6>Total Borrowed Books</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{borrowedProductsCount} items</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card info-bg mb-4">
              <div className="custom-card-header text-center">
                <h6>Total Fees</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{totalFees} ৳</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card danger-bg mb-4">
              <div className="custom-card-header text-center">
                <h6>Total Functional Fees</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{totalFunctionalFees} ৳</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card danger-bg mb-4">
              <div className="custom-card-header text-center">
                <h6>Total Costs</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{totalCosts} ৳</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card danger-bg mb-4">
              <div className="custom-card-header text-center">
                <h6>Total Donations</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{totalDonations} ৳</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="custom-card danger-bg mb-4">
              <div className="custom-card-header text-center">
                <h6>Current Value</h6>
              </div>
              <div className="custom-card-body text-center">
                <h4 className="fw-bold">{currentValue} ৳</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        .custom-card {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .custom-card-header {
          background-color: #13938d;
          padding: 15px;
          font-size: 16px;
          font-weight: bold;
          color: white;
        }

        .custom-card-body {
          padding: 20px;
          font-size: 18px;
          background: #13938d36;
          height:100px;
        }
        `}
      </style>
    </div>
  );
};

export default Home;