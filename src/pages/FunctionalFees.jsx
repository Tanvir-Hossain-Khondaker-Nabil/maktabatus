import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Fees = () => {
  const [functional_fees, setFees] = useState([]);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  // Fetching fees and members data in real-time
  useEffect(() => {
    const unsubscribeFees = onSnapshot(collection(db, 'functional_fees'), (snapshot) => {
      const fetchedFees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFees(fetchedFees);
    });

    const unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeFees();
      unsubscribeMembers();
    };
  }, []);

  // Group and sort fees by Month and Year, latest first
  const groupFeesByMonthYear = () => {
    const sortedFees = functional_fees.sort((a, b) => {
      // Compare year first, then month
      if (b.year === a.year) {
        return b.month - a.month; // If years are the same, compare months
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

  // Navigate to fee details page when clicking on a month-year
  const viewDetails = (month, year) => {
    const paidMemberIds = functional_fees
      .filter((fee) => fee.month === month && fee.year === year)
      .map((fee) => fee.memberId);

    const paidMembers = members.filter((member) =>
      paidMemberIds.includes(member.id)
    );
    const unpaidMembers = members.filter(
      (member) => !paidMemberIds.includes(member.id)
    );

    // Show a SweetAlert when navigating
    Swal.fire({
      icon: 'info',
      title: 'Loading Fee Details',
      text: `Navigating to fee details for ${monthNames[month - 1]} ${year}`,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      navigate('/functional-fee-details', {
        state: {
          month,
          year,
          paidMembers,
          unpaidMembers,
        },
      });
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
                const totalAmount = group.reduce((sum, functional_fee) => sum + functional_fee.amount, 0);

                return (
                  <tr key={monthYearKey}>
                    <td>
                      {month} {year}
                    </td>

                    <td>{totalAmount.toFixed(2)}</td> {/* Display total amount rounded to 2 decimals */}
                    <td>
                      <div className="d-flex justify-content-center align-item-center">
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
