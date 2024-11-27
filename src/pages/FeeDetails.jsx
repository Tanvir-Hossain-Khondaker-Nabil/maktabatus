import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FeeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { month, year, paidMembers, unpaidMembers } = location.state;

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
    <div>
      <h4>
        Details for {monthNames[parseInt(month) - 1]} {year}
      </h4>

      <div>
        <h5>Members Who Paid</h5>
        <table className="fees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {paidMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h5>Members Who Didn't Pay</h5>
        <table className="fees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {unpaidMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeDetails;
