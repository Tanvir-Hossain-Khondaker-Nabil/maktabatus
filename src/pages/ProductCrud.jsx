import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  increment,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import "dropify/dist/css/dropify.min.css"; // Import Dropify styles
import Dropify from "dropify";
import $ from "jquery"; // Import jQuery
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const ProductCrud = () => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowedProducts, setBorrowedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalMemberId, setModalMemberId] = useState(""); // Member ID for borrowing
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
        setLoading(false);
      }
    );

    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const fetchedCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(fetchedCategories);
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

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeMembers();
      unsubscribeBorrowedProducts();
    };
  }, []);

  useEffect(() => {
    $(".dropify").dropify();
    return () => {
      $(".dropify").dropify("destroy");
    };
  }, []);

  const addProduct = async () => {
    if (name && categoryId && price && quantity) {
      const currentDate = new Date().toISOString();
      await addDoc(collection(db, "products"), {
        name,
        categoryId,
        price,
        quantity,
        createDate: currentDate,
      });
      resetForm();
    }
  };

  const updateProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    const currentDate = new Date().toISOString();
    await updateDoc(productDoc, {
      name,
      categoryId,
      price,
      quantity,
      updateDate: currentDate,
    });
    resetForm();
  };

  const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
  };

  const borrowProduct = async (productId, memberId) => {
    if (isProcessing) return; // Prevent duplicate clicks
    setIsProcessing(true);

    const product = products.find((product) => product.id === productId);

    if (product && product.quantity > 0 && memberId) {
      const currentDate = new Date().toISOString();
      const borrowData = {
        productId,
        memberId,
        borrowDate: currentDate,
        productName: product.name,
      };

      try {
        // Decrease quantity in Firestore
        await updateDoc(doc(db, "products", productId), {
          quantity: Number(product.quantity) - Number(1),
        });

        // Add borrowed product to Firestore
        await addDoc(collection(db, "borrowedProducts"), borrowData);

        setIsModalOpen(false); // Close modal
      } catch (error) {
        console.error("Error borrowing product:", error);
        alert("Failed to borrow product.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert("Book out of stock or member not selected.");
      setIsProcessing(false);
    }
  };

  
  const resetForm = () => {
    setName("");
    setCategoryId("");
    setImage(null);
    setPrice("");
    setQuantity("");
    $(".dropify-clear").click();
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h2 className="title">Book Form:</h2>
          <div className="form">
            <div class="row">
              <div class="col-md-4 mb-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="input-field"
                />
              </div>
              <div class="col-md-4 mb-3">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="input-field"
                />
              </div>
              <div class="col-md-4 mb-3">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="input-field"
                />
              </div>
              <div class="col-md-8 mb-3 d-flex justify-content-end">
                {editingId ? (
                  <button
                    onClick={() => updateProduct(editingId)}
                    className="btn btn-warning"
                  >
                    Update
                  </button>
                ) : (
                  <button onClick={addProduct} className="btn add-btn">
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <p className="loading">Loading products...</p>
          ) : (
            <div className="mt-5 overflow-auto">
              {/* Book Table */}
              <h2 className="title">Book Table:</h2>
              <table>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      {categories.find((cat) => cat.id === product.categoryId)
                        ?.name || "N/A"}
                    </td>
                    <td>৳{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <div className="d-flex justify-content-center align-item-center gap-1">
                        <button
                          className="btn action-btn  btn-sm mr-2"
                          onClick={() => {
                            setEditingId(product.id);
                            setName(product.name);
                            setCategoryId(product.categoryId);
                            setPrice(product.price);
                            setQuantity(product.quantity);
                          }}
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn action-btn  btn-sm mr-2"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                        <button
                          className="btn action-btn  btn-sm"
                          onClick={() => {
                            setIsModalOpen(true);
                            setSelectedProductId(product.id);
                          }}
                        >
                          <i class="fa-solid fa-bookmark"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </table>
            </div>
          )}

          {/* Bootstrap Modal for Borrowing */}
          {isModalOpen && (
            <div className="modal show" style={{ display: 'block' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Borrow Book</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={() => setIsModalOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                      <div>
                        <select
                          className="input-field"
                          value={modalMemberId}
                          onChange={(e) => setModalMemberId(e.target.value)}
                        >
                          <option value="">Select Member</option>
                          {members.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn add-btn"
                      onClick={() => {
                        borrowProduct(selectedProductId, modalMemberId);
                      }}
                    >
                      Confirm Borrow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCrud;
