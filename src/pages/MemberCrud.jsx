import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const MemberCrud = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // For Fees
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMemberId, setModalMemberId] = useState('');
  const [modalMonth, setModalMonth] = useState('');
  const [modalAmount] = useState(50);  // Fixed fee amount
  const [modalYear, setModalYear] = useState('');
  const [fees, setFees] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch members data from Firestore on component mount
    const unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      const fetchedMembers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(fetchedMembers);
      setLoading(false);
    });

    // Fetch fees data from Firestore
    const unsubscribeFees = onSnapshot(collection(db, 'fees'), (snapshot) => {
      const fetchedFees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFees(fetchedFees);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeFees();
    };
  }, []);

  // Group fees by month and year (January = 1, February = 2, etc.)
  const groupFeesByMonthYear = () => {
    return fees.reduce((groups, fee) => {
      const monthYearKey = `${fee.month}-${fee.year}`; // Group by month and year (e.g., "1-2024" for January 2024)
      if (!groups[monthYearKey]) {
        groups[monthYearKey] = [];
      }
      groups[monthYearKey].push(fee);
      return groups;
    }, {});
  };

  // Add member
  const addMember = async () => {
    if (!name || !email || !role || !phone) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'members'), { name, email, role ,phone });
      resetForm();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  // Update member
  const updateMember = async (id) => {
    try {
      const memberDoc = doc(db, 'members', id);
      await updateDoc(memberDoc, { name, email, role, phone });
      resetForm();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  // Delete member
  const deleteMember = async (id) => {
    try {
      const memberDoc = doc(db, 'members', id);
      await deleteDoc(memberDoc);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('');
    setPhone('');
    setEditingId(null);
  };

  // Open the modal to add/edit fee
  const openFeeModal = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setModalMemberId(member.id);
      setModalMonth('');
      setModalYear(new Date().getFullYear());  // Set current year
      setIsModalOpen(true);
    }
  };

  // Close the fee modal
  const closeFeeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');  // Reset error message on modal close
  };

  // Check if a fee already exists for the member in the same month and year
  const checkFeeExists = async () => {
    const feeQuery = query(
      collection(db, 'fees'),
      where('memberId', '==', modalMemberId),
      where('month', '==', modalMonth),
      where('year', '==', modalYear)
    );
    const feeSnapshot = await getDocs(feeQuery);
    return !feeSnapshot.empty;
  };

  // Add fee
  const addFee = async () => {
    if (!modalMonth || !modalYear) {
      alert('Please select the month and year.');
      return;
    }

    // Check for duplicate fee in the same month and year
    const feeExists = await checkFeeExists();
    if (feeExists) {
      setErrorMessage('This member has already paid the fee for this month.');
      return;
    }

    try {
      await addDoc(collection(db, 'fees'), {
        memberId: modalMemberId,
        month: modalMonth,
        year: modalYear,
        amount: modalAmount, // Fixed amount
      });
      closeFeeModal();
    } catch (error) {
      console.error('Error adding fee:', error);
    }
  };


  // Generate month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];


  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Book Form:</h2>
        <div className="form">
          <div class="row">
            <div class="col-md-4 mb-3">

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
              className="input-field"
            />
            </div>
            <div class="col-md-4 mb-3">
            <input
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter member phone"
              className="input-field"
            />
            </div>
            <div class="col-md-4 mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member email"
              className="input-field"
            />
            </div>
            <div class="col-md-4 mb-3">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter member role"
              className="input-field"
            />
            </div>
            <div class="col-md-4 mb-3">
              {editingId ? (
                <button onClick={() => updateMember(editingId)} className="btn update-btn">
                  Update
                </button>
              ) : (
                <button onClick={addMember} className="btn add-btn">
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      










      {loading ? (
        <p className="loading">Loading members...</p>
      ) : (
      <div className="mt-5 overflow-auto">
        {/* Book Table */}
        <h2 className="title">Book Table:</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.phone}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>
                  <div className="d-flex justify-content-center align-item-center gap-1">
                    <button
                      className="btn action-btn  btn-sm mr-2"
                      onClick={() => {
                      setName(member.name);
                      setEmail(member.email);
                      setRole(member.role);
                      setEditingId(member.id);
                    }}
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                        className="btn action-btn  btn-sm mr-2"
                        onClick={() => deleteMember(member.id)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>

                      <button
                        className="btn action-btn  btn-sm mr-2"
                        onClick={() => openFeeModal(member.id)}
                      >
                      <i class="fa-solid fa-bangladeshi-taka-sign"></i>
                    </button>
                  </div>  
                </td>
              </tr>
            ))}
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </tbody>
        </table>
      </div>
      )}

      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Monthly Fee</h5>
                <button type="button" className="close" onClick={closeFeeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <label>Member</label>
                  <input
                    type="text"
                    value={members.find((m) => m.id === modalMemberId)?.name || ''}
                    readOnly
                    className="input-field"
                  />
                </div>

                <div>
                  <label>Month</label>
                  <select
                    className="input-field"
                    value={modalMonth}
                    onChange={(e) => setModalMonth(e.target.value)}
                  >
                    <option value="">Select Month</option>
                    {monthNames.map((month, index) => (
                      <option key={index} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Year</label>
                  <input
                    type="number"
                    value={modalYear}
                    readOnly
                    className="input-field"
                  />
                </div>

                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    value={modalAmount}
                    readOnly
                    className="input-field"
                  />
                </div>

                {errorMessage && <p className="error">{errorMessage}</p>}
              </div>
              <div className="modal-footer">
                <button
                  className="btn add-btn"
                  onClick={addFee}
                >
                  Confirm Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default MemberCrud;