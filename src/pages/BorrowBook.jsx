import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc, increment } from "firebase/firestore";
import { db } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";

const BorrowBook = () => {
  const [borrowedProducts, setBorrowedProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribeBorrowedProducts = onSnapshot(
      collection(db, "borrowedProducts"),
      (snapshot) => {
        const fetchedBorrowedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBorrowedProducts(fetchedBorrowedProducts);
      }
    );

    const unsubscribeMembers = onSnapshot(collection(db, "members"), (snapshot) => {
      const fetchedMembers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(fetchedMembers);
    });

    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedProducts);
    });

    return () => {
      unsubscribeBorrowedProducts();
      unsubscribeMembers();
      unsubscribeProducts();
    };
  }, []);

  const finishBorrowing = async (borrowId) => {
    const borrowedProduct = borrowedProducts.find(
      (borrowed) => borrowed.productId === borrowId
    );

    if (borrowedProduct) {
      try {
        await updateDoc(doc(db, "products", borrowId), {
          quantity: increment(1),
        });

        await deleteDoc(doc(db, "borrowedProducts", borrowedProduct.id));
      } catch (error) {
        console.error("Error finishing borrow:", error);
        alert("Failed to finish borrow.");
      }
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Borrow Book Management</h2>
        <div className="mt-5 overflow-auto">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Borrow Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowedProducts.length > 0 ? (
                borrowedProducts.map((borrowed) => (
                  <tr key={borrowed.id}>
                    <td>{borrowed.productName}</td>
                    <td>
                      {/* Find the member based on memberId */}
                      {members.find((member) => member.id === borrowed.memberId) ? (
                        <div>
                          
                          <img
                            src={members.find((member) => member.id === borrowed.memberId)?.imageUrl}
                            alt={members.find((member) => member.id === borrowed.memberId)?.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>{new Date(borrowed.borrowDate).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex justify-content-center align-item-center">
                        <button
                          className="btn action-btn"
                          onClick={() => finishBorrowing(borrowed.productId)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No borrowed books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowBook;
