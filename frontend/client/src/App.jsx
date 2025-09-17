// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [shoes, setShoes] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [newShoe, setNewShoe] = useState({ brandName: '', category: '', price: '', image: null });

  // State for password protection
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const CORRECT_PASSWORD = 'legitverse'; // Replace with a secure, secret password

  // Handle GET request
  const fetchShoes = async () => {
    try {
      const response = await axios.get(`https://shoeapi-s7fv.onrender.com/api/shoes?brandName=${brandName}`);
      setShoes(response.data);
    } catch (error) {
      console.error('Error fetching shoes:', error);
    }
  };

  // Handle POST request
  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('brandName', newShoe.brandName);
      formData.append('category', newShoe.category);
      formData.append('price', newShoe.price);
      formData.append('image', newShoe.image);
      
      await axios.post('https://shoeapi-s7fv.onrender.com/api/shoes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchShoes(); // Refresh the shoe list
      setNewShoe({ brandName: '', category: '', price: '', image: null }); // Clear form
    } catch (error) {
      console.error('Error adding shoe:', error);
    }
  };

  // Handle password submission
  const handleAdminLogin = () => {
    if (adminPassword === CORRECT_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert('Incorrect password!');
      setAdminPassword('');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shoe Inventory 👟</h1>

        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Search Shoes by Brand</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchShoes}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Get Shoes
            </button>
          </div>
        </div>
        
        <hr className="my-8" />

        {/* Display Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Results</h2>
          {shoes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shoes.map((shoe) => (
                <div key={shoe._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105">
                  <img src={shoe.image} alt={shoe.category} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">{shoe.brandName}</h3>
                    <p className="text-gray-600">Category: {shoe.category}</p>
                    <p className="text-gray-800 font-semibold mt-2">Price: ${shoe.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No shoes found for this brand.</p>
          )}
        </div>

        <hr className="my-8" />

        {/* Admin Authorization Section */}
        <div className="admin-section">
          {!isAdmin ? (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Admin Access</h2>
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full max-w-sm p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAdminLogin}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          ) : (
            /* POST Section (Visible only if isAdmin is true) */
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Shoe</h2>
              <form onSubmit={handlePost} className="space-y-4">
                <input
                  type="text"
                  placeholder="Brand Name"
                  value={newShoe.brandName}
                  onChange={(e) => setNewShoe({ ...newShoe, brandName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newShoe.category}
                  onChange={(e) => setNewShoe({ ...newShoe, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newShoe.price}
                  onChange={(e) => setNewShoe({ ...newShoe, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setNewShoe({ ...newShoe, image: e.target.files[0] })}
                  className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
                >
                  Add Shoe
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
