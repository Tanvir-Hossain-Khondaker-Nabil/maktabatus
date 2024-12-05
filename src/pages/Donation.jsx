import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Donation = () => {
  const [donationData, setDonationData] = useState({
    name: '',
    mobile: '',
    amount: '',
    month: '',
    year: new Date().getFullYear(),
  });

  const [error, setError] = useState('');
  const [donations, setDonations] = useState([]); // State to store the list of donations

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  // Fetch donations from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'donations'), (snapshot) => {
      const donationsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonations(donationsList);
    });
    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks for required fields
    if (!donationData.amount || !donationData.month) {
      setError('Amount and Month are required!');
      Swal.fire({
        title: 'Error!',
        text: 'Amount and Month are required!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Reset error if validation passes
    setError('');

    try {
      // Insert the new donation into Firebase
      await addDoc(collection(db, 'donations'), donationData);

      // After successful insert, log the data (optional)
      console.log('Donation Data Submitted:', donationData);

      // Reset form after submission
      setDonationData({
        name: '',
        mobile: '',
        amount: '',
        month: '',
        year: new Date().getFullYear(),
      });

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Donation Submitted Successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error submitting donation!',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'donations', id));
      Swal.fire({
        title: 'Deleted!',
        text: 'Donation deleted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error deleting donation!',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };
  
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Member Management</h2>        
        <form className="form" onSubmit={handleSubmit}>
          <div className="container"> {/* Added container wrapper */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-field"
                  value={donationData.name}
                  onChange={handleChange}
                  placeholder="Enter your name (optional)"
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  className="input-field"
                  value={donationData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number (optional)"
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="input-field"
                  value={donationData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                />
              </div>

              <div className="col-md-4 mb-3">
                <select
                  id="month"
                  name="month"
                  className="input-field"
                  value={donationData.month}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Month</option>
                  {monthNames.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  id="year"
                  name="year"
                  className="input-field"
                  value={donationData.year}
                  readOnly
                />
              </div>

              <div className="col-md-4 mb-3">
                <button type="submit" className="btn add-btn">
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>


        {/* Donations Table */}
        <div className="mt-5 overflow-auto">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Amount</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.name}</td>
                    <td>{donation.mobile}</td>
                    <td>{donation.amount}</td>
                    <td>{donation.month}</td>
                    <td>{donation.year}</td>
                    <td>
                      <div className="d-flex justify-content-center align-item-center">
                      <button
                            className="btn action-btn btn-sm mr-2"
                            onClick={() => handleDelete(donation.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                      </div>
                    </td>
                  </tr>
                ))

              ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No borrowed books found.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Donation;
