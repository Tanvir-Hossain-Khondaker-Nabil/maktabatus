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
import Swal from 'sweetalert2';

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
      try {
        await addDoc(collection(db, 'categories'), { name });
        setName('');
        Swal.fire('Success', 'Category added successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to add category!', 'error');
      }
    } else {
      Swal.fire('Warning', 'Please enter a category name!', 'warning');
    }
  };

  const updateCategory = async (id) => {
    if (name) {
      const categoryDoc = doc(db, 'categories', id);
      try {
        await updateDoc(categoryDoc, { name });
        setName('');
        setEditingId(null);
        Swal.fire('Success', 'Category updated successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to update category!', 'error');
      }
    } else {
      Swal.fire('Warning', 'Please enter a category name!', 'warning');
    }
  };

  const deleteCategory = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const categoryDoc = doc(db, 'categories', id);
        try {
          await deleteDoc(categoryDoc);
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Failed to delete category!', 'error');
        }
      }
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Category Management</h2>
        <div className="form">
          <div className="row">
            <div className="col-md-12">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="input-field mb-3"
              />
            </div>
            <div className="col-md-2">
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
          </div>


        </div>
        <table className="mt-5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <div className="d-flex justify-content-center align-item-center gap-1">
                      <button
                        className="btn action-btn btn-sm mr-2"
                        onClick={() => {
                          setName(category.name);
                          setEditingId(category.id);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn action-btn btn-sm mr-2"
                        onClick={() => deleteCategory(category.id)}
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
    </div>
  );
};

export default CategoryCrud;
