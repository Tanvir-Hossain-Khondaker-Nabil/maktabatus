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
     <div className="card">
      <div className="card-body">
        <h1>
          {monthNames[parseInt(month) - 1]} {year} :
        </h1>
        <div className="row mt-5">
          <div className="col-md-12">
            <h5>Members Who Paid:</h5>
            <table>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                </tr>
                {paidMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.phone}</td>
                    <td>{member.email}</td>
                  </tr>
                ))}
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                </tr>
            </table>
          </div>
          <div className="col-md-12 mt-5">
            <h5>Members Who Didn't Pay:</h5>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {unpaidMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.phone}</td>
                    <td>{member.email}</td>
                  </tr>
                ))}
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>        
    </div>
    </div>
  );
};

export default FeeDetails;
