import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const CategoryCrud = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const fetchedCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(fetchedCategories);
      setLoading(false);
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
    <div className="items-crud">
      <h2 className="title">Category Management</h2>
      <div className="form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="input-field"
        />
        {editingId ? (
          <button onClick={() => updateCategory(editingId)} className="btn update-btn">
            Update
          </button>
        ) : (
          <button onClick={addCategory} className="btn add-btn">
            Add
          </button>
        )}
      </div>

      {loading ? (
        <p className="loading">Loading categories...</p>
      ) : (
        <ul className="items-list">
          {categories.map((category) => (
            <li key={category.id} className="items">
              <span className="items-name">{category.name}</span>
              <div className="actions">
                <button
                  className="btn edit-btn"
                  onClick={() => {
                    setName(category.name);
                    setEditingId(category.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn delete-btn"
                  onClick={() => deleteCategory(category.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryCrud;
