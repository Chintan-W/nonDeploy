import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const RestaurantUpdate = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [name, setName] = useState('');
  const [borough, setBorough] = useState('');
  const [cuisine, setCuisine] = useState('');
  const authToken = localStorage.getItem('token');
const navigate = useNavigate();
  const handleSearchRestaurant = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
      
      if (!response.data) {
        alert('Restaurant not found');
        clearFields();
        return;
      }

      const restaurant = response.data;
      setName(restaurant.name || '');
      setBorough(restaurant.borough || '');
      setCuisine(restaurant.cuisine || '');
    } catch (error) {
      console.error('Error searching for restaurant:', error);
      alert('An error occurred while searching for the restaurant');
    }
  };

  const handleUpdateRestaurant = async () => {
    try {
      const updatedRestaurant = {
        name,
        borough,
        cuisine,
      };
      if (!authToken) {
        alert('You must be logged in to update a restaurant.');
        navigate('/login');
        return;
      }
      if(authToken){
      const response = await axios.put(`http://localhost:5000/api/restaurants/${restaurantId}`, updatedRestaurant);
      
      if (response.data) {
        alert('Restaurant updated successfully');
        clearFields();
      } else {
        alert('Restaurant not found');
      }}
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('An error occurred while updating the restaurant');
    }
  };


  const clearFields = () => {
    setRestaurantId('');
    setName('');
    setBorough('');
    setCuisine('');
  };

  return (
    <div className="container mt-5">
      <h2>Update Restaurant</h2>
      <div className="mb-3">
        <label className="form-label">Restaurant ID:</label>
        <input type="text" className="form-control" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} />
        <button className="btn btn-primary" onClick={handleSearchRestaurant}>Search</button>
      </div>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Borough:</label>
        <input type="text" className="form-control" value={borough} onChange={(e) => setBorough(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Cuisine:</label>
        <input type="text" className="form-control" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={handleUpdateRestaurant}>
        Update Restaurant
      </button>
      <br />
    </div>
  );
};

export default RestaurantUpdate;
