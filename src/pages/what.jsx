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
  const [role, setRole] = useState('');
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // For Fees and Additional Fees
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isAdditionalFeeModalOpen, setIsAdditionalFeeModalOpen] = useState(false);
  const [modalMemberId, setModalMemberId] = useState('');
  const [modalMonth, setModalMonth] = useState('');
  const [modalAmount] = useState(50); // Fixed fee amount
  const [modalYear, setModalYear] = useState('');
  const [fees, setFees] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [additionalFeeAmount, setAdditionalFeeAmount] = useState('');

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

  // Open the modal to add/edit fee
  const openFeeModal = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setModalMemberId(member.id);
      setModalMonth('');
      setModalYear(new Date().getFullYear());  // Set current year
      setIsFeeModalOpen(true);
    }
  };

  // Open additional fee modal
  const openAdditionalFeeModal = (memberId) => {
    setModalMemberId(memberId);
    setModalMonth('');
    setModalYear(new Date().getFullYear());  // Set current year
    setIsAdditionalFeeModalOpen(true);
  };

  // Close the fee modal
  const closeFeeModal = () => {
    setIsFeeModalOpen(false);
    setErrorMessage('');  // Reset error message on modal close
  };

  // Close the additional fee modal
  const closeAdditionalFeeModal = () => {
    setIsAdditionalFeeModalOpen(false);
    setAdditionalFeeAmount('');
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

  // Update additional fee
  const updateAdditionalFee = async () => {
    if (!additionalFeeAmount) {
      alert('Please enter an additional fee amount.');
      return;
    }

    const currentFee = fees.find(
      (fee) => fee.memberId === modalMemberId && fee.month === modalMonth && fee.year === modalYear
    );

    if (!currentFee) {
      setErrorMessage('No fee record found for this month and year.');
      return;
    }

    const updatedAmount = currentFee.amount + parseFloat(additionalFeeAmount);

    try {
      const feeDoc = doc(db, 'fees', currentFee.id);
      await updateDoc(feeDoc, { amount: updatedAmount });
      closeAdditionalFeeModal();
    } catch (error) {
      console.error('Error updating additional fee:', error);
    }
  };

  // Generate month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return (
    <div className="items-crud">
      <h2 className="title">Members Management</h2>
      {/* Members and Fees Management Form */}
      <div className="form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter member name"
          className="input-field"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter member email"
          className="input-field"
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter member role"
          className="input-field"
        />
      </div>

      {loading ? (
        <p className="loading">Loading members...</p>
      ) : (
        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>
                  <button className="btn edit-btn" onClick={() => openFeeModal(member.id)}>
                    Monthly Fee
                  </button>
                  <button className="btn add-btn" onClick={() => openAdditionalFeeModal(member.id)}>
                    Add Additional Fee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Additional Fee Modal */}
      {isAdditionalFeeModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Additional Fee</h5>
                <button type="button" className="close" onClick={closeAdditionalFeeModal}>
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
                    className="form-control"
                    value={modalMonth}
                    onChange={(e) => setModalMonth(e.target.value)}
                  >
                    <option value="">Select Month</option>
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>{month}</option>
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
                  <label>Additional Fee Amount</label>
                  <input
                    type="number"
                    value={additionalFeeAmount}
                    onChange={(e) => setAdditionalFeeAmount(e.target.value)}
                    className="input-field"
                  />
                </div>

                {errorMessage && <p className="error">{errorMessage}</p>}
              </div>
              <div className="modal-footer">
                <button className="btn add-btn" onClick={updateAdditionalFee}>
                  Confirm Additional Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberCrud;
