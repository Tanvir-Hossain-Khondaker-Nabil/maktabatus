import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Real-time listener for fees collection
    const unsubscribeFees = onSnapshot(collection(db, 'fees'), (snapshot) => {
      setFees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Real-time listener for members collection
    const unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Cleanup listeners when the component is unmounted
    return () => {
      unsubscribeFees();
      unsubscribeMembers();
    };
  }, []);

  const groupFeesByMonthYear = () => {
    // Sort fees by year and month in descending order
    const sortedFees = fees.sort((a, b) => {
      // Compare year first, then month
      if (b.year === a.year) {
        return b.month - a.month; // If years are equal, compare months
      }
      return b.year - a.year; // Otherwise compare years
    });

    return sortedFees.reduce((groups, fee) => {
      const monthYearKey = `${fee.month}-${fee.year}`;
      if (!groups[monthYearKey]) {
        groups[monthYearKey] = [];
      }
      groups[monthYearKey].push({ ...fee, amount: parseFloat(fee.amount) });
      return groups;
    }, {});
  };

  const groupedFees = groupFeesByMonthYear();

  // Get the latest month-year group (most recent fees)
  const latestMonthYear = Object.keys(groupedFees)[0];
  const latestFees = groupedFees[latestMonthYear] || [];

  const viewDetails = (month, year) => {
    const paidMemberIds = fees
      .filter((fee) => fee.month === month && fee.year === year)
      .map((fee) => fee.memberId);

    const paidMembers = members.filter((member) =>
      paidMemberIds.includes(member.id)
    );
    const unpaidMembers = members.filter(
      (member) => !paidMemberIds.includes(member.id)
    );

    // Navigate to fee details page with the data passed as state
    navigate('/fee-details', {
      state: {
        month,
        year,
        paidMembers,
        unpaidMembers,
      },
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Fees Management</h2>
        <div className="mt-5 overflow-auto">
          <table>
            <thead>
              <tr>
                <th>Month-Year</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedFees).map((monthYearKey) => {
                const [month, year] = monthYearKey.split('-');
                const group = groupedFees[monthYearKey];
                
                // Calculate the total amount correctly
                const totalAmount = group.reduce((sum, fee) => sum + fee.amount, 0);

                return (
                  <tr key={monthYearKey}>
                    <td>
                      {month} {year}
                    </td>

                    <td>{totalAmount.toFixed(2)}</td> {/* Display total amount rounded to 2 decimals */}
                    <td><div className="d-flex justify-content-center align-item-center">
                      <button
                            className="btn action-btn btn-sm mr-2"
                            onClick={() => viewDetails(month, parseInt(year))}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fees;
