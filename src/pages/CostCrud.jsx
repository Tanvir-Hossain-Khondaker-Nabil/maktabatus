import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation

const CostCrud = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  const [form, setForm] = useState({
    name: '',
    type: 'Buy Books',
    amount: '',
    month: '',
    year: currentYear.toString(), // Pre-fill with current year
    description: '',
  });
  const [costs, setCosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [costsPerPage] = useState(5); // Number of costs per page

  // Fetch costs from Firestore
  useEffect(() => {
    // Fetch costs from Firestore, sorted by month and year
    const unsubscribe = onSnapshot(collection(db, 'costs'), (snapshot) => {
      const fetchedCosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort costs by year (descending) and then month (descending)
      fetchedCosts.sort((a, b) => {
        // Compare years first
        if (b.year !== a.year) {
          return b.year - a.year;
        }
        // If years are the same, compare months
        return b.month - a.month;
      });

      setCosts(fetchedCosts);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addCost = async () => {
    const { name, type, amount, month, year, description } = form;

    if (name && type && amount && month && year) {
      try {
        await addDoc(collection(db, 'costs'), { name, type, amount, month, year, description });
        setForm({
          name: '',
          type: 'Buy Books',
          amount: '',
          month: '',
          year: currentYear.toString(), // Reset to current year
          description: '',
        });

        // Show success SweetAlert
        Swal.fire({
          title: 'Success!',
          text: 'Cost added successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error adding the cost.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } else {
      setError('All fields are required.');
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all fields.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const updateCost = async (id) => {
    const costDoc = doc(db, 'costs', id);

    try {
      await updateDoc(costDoc, { ...form });
      setForm({
        name: '',
        type: 'Buy Books',
        amount: '',
        month: '',
        year: currentYear.toString(), // Reset to current year
        description: '',
      });
      setEditingId(null);

      // Show success SweetAlert
      Swal.fire({
        title: 'Updated!',
        text: 'Cost updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the cost.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const deleteCost = async (id) => {
    const costDoc = doc(db, 'costs', id);

    try {
      await deleteDoc(costDoc);

      // Show success SweetAlert
      Swal.fire({
        title: 'Deleted!',
        text: 'Cost deleted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error deleting the cost.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
  ];

  const paginateCosts = () => {
    // Calculate indices for pagination
    const indexOfLastCost = currentPage * costsPerPage;
    const indexOfFirstCost = indexOfLastCost - costsPerPage;
    return costs.slice(indexOfFirstCost, indexOfLastCost);
  };
  
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(costs.length / costsPerPage);

  const generatePDFVoucher = (cost) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text(`Cost Voucher: ${cost.name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Voucher Details: ${cost.name}`, 20, 30);

    // Table Header and Data
    const header = ['Field', 'Details'];
    const data = [
      ['Type', cost.type],
      ['Amount', `${cost.amount} ৳`],
      ['Month', cost.month],
      ['Year', cost.year],
      ['Description', cost.description],
    ];

    // Y position after the title
    let yPosition = 40;

    // Draw the table
    doc.autoTable({
      startY: yPosition,
      head: [header],
      body: data,
      margin: { top: yPosition + 10, left: 20 },

      styles: {
        fontSize: 10,  // Smaller font size to fit better
        cellPadding: 2,  // Reduced padding to minimize row height
        halign: 'center',  // Center align table content
        fillColor: [144, 238, 144],  // Soft green background for header
        textColor: [0, 0, 0],  // Black font color for header
        lineColor: [0, 0, 0],  // Black border lines for table
        lineWidth: 0.1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],  // White background for table data cells
        textColor: [0, 0, 0],  // Black font color for table data cells
      }
    });

    // Save the PDF with a filename based on the cost name
    doc.save(`${cost.name}_voucher.pdf`);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Cost Management</h2>
        <div className="form">
          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter cost name"
                className="input-field"
              />
            </div>
            <div className="col-md-4 mb-3">
              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Buy Books">Buy Books</option>
                <option value="Functional Cost">Functional Cost</option>
                <option value="Other Cost">Other Cost</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="input-field"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                className="input-field"
              ></textarea>
            </div>
            <div className="col-md-4 mb-3">
              <select
                name="month"
                className="input-field"
                value={form.month}
                onChange={handleInputChange}
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
                value={form.year}
                readOnly // Make this field read-only
                className="input-field"
              />
            </div>

            {error && <div className="text-danger">{error}</div>}
            <div className="col-md-4 mb-3">
              {editingId ? (
                <button
                  onClick={() => updateCost(editingId)}
                  className="btn btn-warning"
                >
                  Update
                </button>
              ) : (
                <button onClick={addCost} className="btn add-btn">
                  Add
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Month</th>
                <th>Year</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginateCosts().length > 0 ? (
                paginateCosts().map((cost) => (
                  <tr key={cost.id}>
                    <td>{cost.name}</td>
                    <td>{cost.type}</td>
                    <td>{cost.amount} ৳</td>
                    <td>{cost.month}</td>
                    <td>{cost.year}</td>
                    <td>{cost.description}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-1">
                        <button
                          className="btn action-btn btn-sm mr-2"
                          onClick={() => {
                            setForm({
                              name: cost.name,
                              type: cost.type,
                              amount: cost.amount,
                              month: cost.month,
                              year: cost.year,
                              description: cost.description,
                            });
                            setEditingId(cost.id);
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn action-btn btn-sm mr-2"
                          onClick={() => deleteCost(cost.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <button
                          className="btn action-btn btn-sm"
                          onClick={() => generatePDFVoucher(cost)}
                        >
                          <i className="fa-solid fa-file-pdf"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No costs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <style>
        {`
        .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.pagination button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
}

.pagination button:disabled {
    background-color: #c6c6c6;
    cursor: not-allowed;
}

.pagination span {
    font-size: 14px;
}

.pagination button:hover:not(:disabled) {
    background-color: #0056b3;
}
`}
      </style>
    </div>
  );
};

export default CostCrud;
