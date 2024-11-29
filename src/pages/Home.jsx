import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Home = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const itemsCollection = collection(db, "items");

  // Fetch Items
  const fetchItems = async () => {
    try {
      const data = await getDocs(itemsCollection);
      setItems(data.docs.map((doc, index) => ({
        ...doc.data(),
        id: doc.id,
        index: index + 1,
      })));
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Error fetching items. Check console for details.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []); // Fetch items when the component mounts

  // Add Item
  const addItem = async () => {
    if (!title || !image) return alert("Title and Image are required!");

    // Validate file type (only allow images)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(image.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF).');
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `images/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(snapshot.ref);
      console.log("Image URL:", imageUrl);

      // Add item to Firestore
      await addDoc(itemsCollection, { title, imageUrl });
      console.log("Item added successfully");

      // Refresh items list
      fetchItems();

      // Clear input fields
      setTitle("");
      setImage(null);
    } catch (error) {
      console.error("Error adding item:", error);
      alert(`Error adding item. Check console for details: ${error.message}`);
    }
  };


  // Update Item
  const updateItem = async () => {
    if (!title) return alert("Title is required for update!");

    try {
      const itemDoc = doc(db, "items", editingId);
      await updateDoc(itemDoc, { title });

      // Refresh the list of items
      fetchItems();
      
      // Reset editing state
      setEditingId(null);
      setTitle("");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item. Check console for details.");
    }
  };

  // Delete Item
  const deleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "items", id);
      await deleteDoc(itemDoc);

      // Refresh the list of items
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item. Check console for details.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Firebase CRUD with Image</h2>

      {/* Form Section */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          className="form-control mt-2"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {editingId ? (
          <button className="btn btn-primary mt-2" onClick={updateItem}>
            Update Item
          </button>
        ) : (
          <button className="btn btn-success mt-2" onClick={addItem}>
            Add Item
          </button>
        )}
      </div>

      {/* Items Table */}
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.index}</td>
                <td>{item.title}</td>
                <td>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingId(item.id);
                      setTitle(item.title);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
