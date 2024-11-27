import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

const CategoryCrud = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const fetchedCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(fetchedCategories);
    });

    return () => unsubscribe();
  }, []);

  const addCategory = async () => {
    if (name) {
      await addDoc(collection(db, 'categories'), { name });
      setName('');
    }
  };

  const updateCategory = async (id) => {
    const categoryDoc = doc(db, 'categories', id);
    await updateDoc(categoryDoc, { name });
    setName('');
    setEditingId(null);
  };

  const deleteCategory = async (id) => {
    const categoryDoc = doc(db, 'categories', id);
    await deleteDoc(categoryDoc);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Category Management</h2>
        <div className="form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="input-field mb-3"
          />
          {editingId ? (
            <button onClick={() => updateCategory(editingId)} className="btn btn-warning">
              Update
            </button>
          ) : (
            <button onClick={addCategory} className="btn add-btn">
              Add
            </button>
          )}
        </div>
        <table className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <div className="d-flex justify-content-center align-item-center gap-1">
                    <button
                      className="btn action-btn  btn-sm mr-2"
                      onClick={() => {
                        setName(category.name);
                        setEditingId(category.id);
                      }}
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="btn action-btn  btn-sm mr-2"
                       onClick={() => deleteCategory(category.id)}
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryCrud;
