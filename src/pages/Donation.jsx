import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Donation = () => {
  const [donationData, setDonationData] = useState({
    name: '',
    mobile: '',
    amount: '',
    month: '',
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [donations, setDonations] = useState([]);
  const [editId, setEditId] = useState(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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

    setError('');

    try {
      if (editId) {
        await updateDoc(doc(db, 'donations', editId), donationData);
        Swal.fire({
          title: 'Updated!',
          text: 'Donation updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        await addDoc(collection(db, 'donations'), donationData);
        Swal.fire({
          title: 'Success!',
          text: 'Donation submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }

      setDonationData({
        name: '',
        mobile: '',
        amount: '',
        month: '',
        year: new Date().getFullYear(),
      });
      setEditId(null);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error submitting donation!',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleEdit = (donation) => {
    setDonationData(donation);
    setEditId(donation.id);
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
      Swal.fire({
        title: 'Error!',
        text: 'Error deleting donation!',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };
  const generatePDFVoucher = (donation) => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(16);
    doc.text(`Donation Voucher`, 20, 20);
  
    // Add a table with customized styles
    doc.autoTable({
      startY: 40, // Start position for the table
      head: [['Field', 'Details']],
      body: [
        ['Name', donation.name || 'Anonymous'],
        ['Mobile', donation.mobile || 'N/A'],
        ['Amount', `${donation.amount} tk`],
        ['Month', donation.month],
        ['Year', donation.year],
      ],
      margin: { top: 10, left: 20 },
      headStyles: {
        fillColor: [144, 238, 144], // Soft green background for header
        textColor: [0, 0, 0], // Black text for header
        fontSize: 12, // Font size for header
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // White background for table data cells
        textColor: [0, 0, 0], // Black font color for table data cells
        fontSize: 10, // Smaller font size for table data
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray background for alternate rows
      },
      styles: {
        lineColor: [0, 0, 0], // Black border lines for table
        lineWidth: 0.1, // Thin lines
        halign: 'center', // Center align table content
      },
    });
  
    // Save the PDF
    doc.save(`Donation_Voucher_${donation.name || 'Anonymous'}.pdf`);
  };
  
  

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Donation Management</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-3">
                <input
                  type="text"
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
                  name="amount"
                  className="input-field"
                  value={donationData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                />
              </div>
              <div className="col-md-4 mb-3">
                <select
                  name="month"
                  className="input-field"
                  value={donationData.month}
                  onChange={handleChange}
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
                  name="year"
                  className="input-field"
                  value={donationData.year}
                  readOnly
                />
              </div>
              <div className="col-md-4 mb-3">
                <button type="submit" className="btn add-btn">
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-5 overflow-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Month</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.name || 'Anonymous'}</td>
                    <td>{donation.mobile || 'N/A'}</td>
                    <td>{donation.amount} ৳</td>
                    <td>{donation.month}</td>
                    <td>{donation.year}</td>
                    <td>
                      <div className="d-flex">
                        <button
                          className="btn action-btn btn-sm mr-2"
                          onClick={() => handleEdit(donation)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          className="btn action-btn btn-sm mr-2"
                          onClick={() => handleDelete(donation.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <button
                          className="btn action-btn btn-sm"
                          onClick={() => generatePDFVoucher(donation)}
                        >
                          <i className="fa-solid fa-file-pdf"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No donations found.
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
