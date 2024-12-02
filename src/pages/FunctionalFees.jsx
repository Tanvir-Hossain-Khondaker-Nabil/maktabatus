import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Fees = () => {
  const [functional_fees, setFees] = useState([]);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeFees = onSnapshot(collection(db, 'functional_fees'), (snapshot) => {
      setFees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeFees();
      unsubscribeMembers();
    };
  }, []);

  const groupFeesByMonthYear = () => {
    return functional_fees.reduce((groups, functional_fee) => {
      const monthYearKey = `${functional_fee.month}-${functional_fee.year}`;
      if (!groups[monthYearKey]) {
        groups[monthYearKey] = [];
      }
      // Ensure that the amount is treated as a number
      groups[monthYearKey].push({ ...functional_fee, amount: parseFloat(functional_fee.amount) });
      return groups;
    }, {});
  };

  const groupedFees = groupFeesByMonthYear();

  const viewDetails = (month, year) => {
    const paidMemberIds = functional_fees
      .filter((functional_fee) => functional_fee.month === month && functional_fee.year === year )
      .map((functional_fee) => functional_fee.memberId);

    const paidMembers = members.filter((member) =>
      paidMemberIds.includes(member.id)
    );
    const unpaidMembers = members.filter(
      (member) => !paidMemberIds.includes(member.id)
    );

    navigate('/functional-fee-details', {
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
