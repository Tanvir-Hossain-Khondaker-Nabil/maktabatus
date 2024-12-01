import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import "dropify/dist/css/dropify.min.css";
import Dropify from "dropify";
import $ from "jquery";

const MemberCrud = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // For Fees Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFunctionalModalOpen, setFunctionalModalOpen] = useState(false);
  const [modalMemberId, setModalMemberId] = useState('');
  const [modalMonth, setModalMonth] = useState('');
  const [modalAmount, setModalAmount] = useState(50);
  const [modalYear, setModalYear] = useState('');
  const [fees, setFees] = useState([]);
  const [functionalFees, setFunctionalFees] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      const fetchedMembers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(fetchedMembers);
      setLoading(false);
    });

    const unsubscribeFees = onSnapshot(collection(db, 'fees'), (snapshot) => {
      const fetchedFees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFees(fetchedFees);
    });

    const unsubscribeFunctionalFees = onSnapshot(collection(db, 'functional_fees'), (snapshot) => {
      const fetchedFunctionalFees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFunctionalFees(fetchedFunctionalFees);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeFees();
      unsubscribeFunctionalFees();
    };
  }, []);

  const uploadImage = (imageFile) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `members/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        () => { },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Add member
  const addMember = async () => {
    if (!name || !email || !role || !phone) {
      alert('Please fill in all fields.');
      return;
    }

    let imageDownloadUrl = '';
    if (image) {
      imageDownloadUrl = await uploadImage(image);
    }

    try {
      await addDoc(collection(db, 'members'), {
        name,
        email,
        role,
        phone,
        imageUrl: imageDownloadUrl,
      });
      resetForm();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  // Update member
  const updateMember = async (id) => {
    let imageDownloadUrl = imageUrl;
    if (image) {
      imageDownloadUrl = await uploadImage(image);
    }

    try {
      const memberDoc = doc(db, 'members', id);
      await updateDoc(memberDoc, {
        name,
        email,
        role,
        phone,
        imageUrl: imageDownloadUrl,
      });
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

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('');
    setPhone('');
    setImage(null);
    setEditingId(null);
  };

  // Handle Fees
  const openFeeModal = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setModalMemberId(member.id);
      setModalMonth('');
      setModalYear(new Date().getFullYear());
      setModalAmount(50); // Default fee amount
      setIsModalOpen(true); // Open regular fee modal
      setFunctionalModalOpen(false); // Ensure functional modal is closed
      setErrorMessage(''); // Reset error message when opening modal
    }
  };

  const openFeeModalFunctionalFees = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setModalMemberId(member.id);
      setModalMonth('');
      setModalYear(new Date().getFullYear());
      setModalAmount(50); // Default functional fee amount
      setFunctionalModalOpen(true); // Open functional fee modal
      setIsModalOpen(false); // Ensure regular modal is closed
      setErrorMessage(''); // Reset error message when opening modal
    }
  };

  const closeFeeModal = () => {
    setFunctionalModalOpen(false);  // Close functional fee modal
    setIsModalOpen(false);            // Close regular modal
    setErrorMessage('');              // Reset error message
  };

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

  const checkFunctionalFeeExists = async () => {
    const feeQuery = query(
      collection(db, 'functional_fees'),
      where('memberId', '==', modalMemberId),
      where('month', '==', modalMonth),
      where('year', '==', modalYear)
    );
    const feeSnapshot = await getDocs(feeQuery);
    return !feeSnapshot.empty;
  };

  const addFee = async () => {
    if (!modalMonth || !modalYear) {
      alert('Please select the month and year.');
      return;
    }

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
        amount: modalAmount,
      });
      closeFeeModal();
    } catch (error) {
      console.error('Error adding fee:', error);
    }
  };

  const addFunctionalFee = async () => {
    if (!modalMonth || !modalYear) {
      alert('Please select the month and year.');
      return;
    }

    const feeExists = await checkFunctionalFeeExists();
    if (feeExists) {
      setErrorMessage('This member has already paid the functional fee for this month.');
      return;
    }

    try {
      await addDoc(collection(db, 'functional_fees'), {
        memberId: modalMemberId,
        month: modalMonth,
        year: modalYear,
        amount: modalAmount,
      });
      closeFeeModal();
    } catch (error) {
      console.error('Error adding functional fee:', error);
    }
  };

  useEffect(() => {
    $(".dropify").dropify();
    return () => {
      $(".dropify").dropify("destroy");
    };
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];


  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Member Management</h2>
        <div className="form">
          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter member name"
                className="input-field"
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter member phone"
                className="input-field"
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter member email"
                className="input-field"
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter member role"
                className="input-field"
              />
            </div>
            <div className="col-md-7 mb-3">
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])} // Handle image selection
                className="dropify"
              />
            </div>
            <div className="col-md-1 mb-3">
              {editingId ? (
                <button onClick={() => updateMember(editingId)} className="btn btn-warning">
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
          <p className="loading"></p>
        ) : (
          <div className="mt-5 overflow-auto">
            {/* Member Table */}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Image</th> {/* Add an Image column */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ? (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.phone}</td>
                      <td>{member.email}</td>
                      <td>{member.role}</td>
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
                      <td>
                        <div className="d-flex justify-content-center align-item-center gap-1">
                          <button
                            className="btn action-btn btn-sm mr-2"
                            onClick={() => {
                              setName(member.name);
                              setEmail(member.email);
                              setRole(member.role);
                              setPhone(member.phone);
                              setImageUrl(member.imageUrl);
                              setEditingId(member.id);
                            }}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            className="btn action-btn btn-sm mr-2"
                            onClick={() => deleteMember(member.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="btn action-btn btn-sm mr-2"
                            onClick={() => openFeeModal(member.id)}
                          >
                            <i className="fa-solid fa-bangladeshi-taka-sign"></i>
                          </button>
                          <button
                            className="btn action-btn btn-sm mr-2"
                            onClick={() => openFeeModalFunctionalFees(member.id)} // Open the modal for the specific member
                          >
                            <i className="fa-solid fa-bangladeshi-taka-sign"></i>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No members found.
                    </td>
                  </tr>
                )}
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
                      onChange={(e) => setModalAmount(e.target.value)} // Allow change in amount
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


        {/* Functional Fee Modal */}
        <div className={`modal`} style={{ display: isFunctionalModalOpen ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Functional Fee</h5>
                <button type="button" className="close" onClick={closeFeeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="month">Month</label>
                  <select
                    id="month"
                    value={modalMonth}
                    onChange={(e) => setModalMonth(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select Month</option>
                    {monthNames.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <input
                    type="number"
                    id="year"
                    value={modalYear}
                    onChange={(e) => setModalYear(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    value={modalAmount}
                    onChange={(e) => setModalAmount(Number(e.target.value))}
                    className="form-control"
                  />
                </div>
                {errorMessage && <div className="text-danger">{errorMessage}</div>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeFeeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addFunctionalFee}
                >
                  Add Functional Fee
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      <style>
        {`
        .dropify-wrapper .dropify-message {
          top: 25%;
        }
        .dropify-wrapper {
            min-width:100%;
            margin: 0 auto;
            border-radius: 22px;
            border: 1px solid #13938d;
        }
        .dropify-wrapper .dropify-message span.file-icon {
            position: absolute;
            width: 100% !important;
            left: 0%;
            top: 0%;
        }
        .dropify-wrapper:hover{
                background: #f8f9fa;
        }
        .dropify-wrapper .dropify-message p {
            font-size: 16px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
        .dropify-wrapper .dropify-message span.file-icon {
            position: absolute;
            width: 100% !important;
            left: 0%;
            top: 0%;
        }
      `}
      </style>
    </div>
  );
};

export default MemberCrud;
