// BorrowedProductsTable.js
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase"; // Ensure Firebase is set up correctly

const BorrowedProductsTable = () => {
  const [borrowedProducts, setBorrowedProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch borrowed products from Firestore
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

    const unsubscribeMembers = onSnapshot(
      collection(db, "members"),
      (snapshot) => {
        const fetchedMembers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMembers(fetchedMembers);
      }
    );

    // Cleanup the listeners when component unmounts
    return () => {
      unsubscribeBorrowedProducts();
      unsubscribeMembers();
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Customize the format as needed
  };

  // Finish borrowing (increase product quantity and remove borrowed record)
  const finishBorrowing = async (borrowId) => {
    if (isProcessing) return; // Prevent duplicate clicks
    setIsProcessing(true);

    const borrowedProduct = borrowedProducts.find(
      (borrowed) => borrowed.productId === borrowId
    );

    if (borrowedProduct) {
      try {
        // Increase quantity of the product in Firestore
        await updateDoc(doc(db, "products", borrowId), {
          quantity: 1, // assuming you want to increase the quantity by 1
        });

        // Remove borrowed product from Firestore
        await deleteDoc(doc(db, "borrowedProducts", borrowedProduct.id));
      } catch (error) {
        console.error("Error finishing borrow:", error);
        alert("Failed to finish borrow.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      <h3 className="my-3">Borrowed Products</h3>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Product</th>
            <th>Member</th>
            <th>Borrow Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowedProducts.length > 0 ? (
            borrowedProducts.map((borrowed) => (
              <tr key={borrowed.productId}>
                <td>{borrowed.productName}</td>
                <td>
                  {members.find((member) => member.id === borrowed.memberId)
                    ?.name || "N/A"}
                </td>
                <td>{formatDate(borrowed.borrowDate)}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => finishBorrowing(borrowed.productId)}
                  >
                    Finish Borrow
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No borrowed products available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedProductsTable;
