import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';

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

  // Handle fee deletion with SweetAlert2 confirmation
  const handleDeleteFee = async (memberId) => {
    try {
      // Show SweetAlert2 confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this fee record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      // If user confirms the deletion
      if (result.isConfirmed) {
        const feesQuery = query(
          collection(db, 'functional_fees'),
          where('memberId', '==', memberId),
          where('month', '==', month),
          where('year', '==', parseInt(year))
        );

        const querySnapshot = await getDocs(feesQuery);

        if (!querySnapshot.empty) {
          const feeDoc = querySnapshot.docs[0]; // Assuming one functional_fee per member for a specific month and year
          await deleteDoc(doc(db, 'functional_fees', feeDoc.id));
          Swal.fire('Deleted!', 'The fee record has been deleted.', 'success');
          navigate(-1); // Navigate back to the previous page
        } else {
          Swal.fire('Error', 'No functional_fee record found for this member.', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'The fee record was not deleted.', 'info');
      }
    } catch (error) {
      console.error('Error deleting functional_fee record:', error);
      Swal.fire('Error', 'Failed to delete functional_fee record. Please try again.', 'error');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h1>
          {month} {year} :
        </h1>
        <div className="row mt-5">
          <div className="col-md-12">
            <h5>Members Who Paid:</h5>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Image</th>
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
                    <td>
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                    <td>{member.phone}</td>
                    <td>{member.email}</td>
                    <td>
                    <div className="d-flex justify-content-center align-item-center">
                      <button
                            className="btn action-btn btn-sm mr-2"
                            onClick={() => handleDeleteFee(member.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          </div>
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
                  <th>Image</th>
                  <th>Mobile</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
              {unpaidMembers.length > 0 ? (
                unpaidMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
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