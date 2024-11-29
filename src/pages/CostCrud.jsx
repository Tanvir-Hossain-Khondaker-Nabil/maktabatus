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

  // Fetch costs from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'costs'), (snapshot) => {
      const fetchedCosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
      await addDoc(collection(db, 'costs'), { name, type, amount, month, year, description });
      setForm({
        name: '',
        type: 'Buy Books',
        amount: '',
        month: '',
        year: currentYear.toString(), // Reset to current year
        description: '',
      });
    } else {
      setError('All fields are required.');
    }
  };

  const updateCost = async (id) => {
    const costDoc = doc(db, 'costs', id);

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
  };

  const deleteCost = async (id) => {
    const costDoc = doc(db, 'costs', id);
    await deleteDoc(costDoc);
  };

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
              {costs.map((cost) => (
                <tr key={cost.id}>
                  <td>{cost.name}</td>
                  <td>{cost.type}</td>
                  <td>{cost.amount} tk</td>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostCrud;
