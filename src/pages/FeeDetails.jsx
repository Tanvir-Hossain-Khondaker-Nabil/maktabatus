import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

  const handleDeleteFee = async (memberId) => {
    try {
      const feesQuery = query(
        collection(db, 'fees'),
        where('memberId', '==', memberId),
        where('month', '==', month),
        where('year', '==', parseInt(year))
      );

      const querySnapshot = await getDocs(feesQuery);

      if (!querySnapshot.empty) {
        const feeDoc = querySnapshot.docs[0]; // Assuming one fee per member for a specific month and year
        await deleteDoc(doc(db, 'fees', feeDoc.id));
        alert('Fee record deleted successfully.');
        navigate(-1); // Navigate back to the previous page
      } else {
        alert('No fee record found for this member.');
      }
    } catch (error) {
      console.error('Error deleting fee record:', error);
      alert('Failed to delete fee record. Please try again.');
    }
  };

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
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {paidMembers.length > 0 ? (
                paidMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.phone}</td>
                    <td>{member.email}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteFee(member.id)}
                      >
                        Delete Fee
                      </button>
                    </td>
                  </tr>
                ))

              ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No borrowed books found.
                      </td>
                    </tr>
                  )}
              </tbody>
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
              {unpaidMembers.length > 0 ? (
                unpaidMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.phone}</td>
                    <td>{member.email}</td>
                  </tr>
                ))

              ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No borrowed books found.
                      </td>
                    </tr>
                  )}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;