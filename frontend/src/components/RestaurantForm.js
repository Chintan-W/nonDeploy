import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const RestaurantForm = () => {
  const [name, setName] = useState('');
  const [borough, setBorough] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [building, setBuilding] = useState('');
  const [coord, setCoord] = useState([]);
  const [street, setStreet] = useState('');
  const [zipcode, setZipcode] = useState('');
  const authToken = localStorage.getItem('token');
const navigate = useNavigate();
  const handleCreateRestaurant = async () => {
    try {
      const newRestaurant = {
        name,
        borough,
        cuisine,
        restaurant_id: Math.floor(Math.random() * 100000000).toString(), // Generate a random restaurant_id 
        address: {
          building,
          coord: coord.map(Number),
          street,
          zipcode,
        },
      };
      if (!authToken) {
        alert('You must be logged in to create a restaurant.');
        navigate('/login');
        return;
      }
      if(authToken){
        const response = await axios.post('http://localhost:5000/api/restaurants', newRestaurant);
        console.log('New restaurant created:', response.data);

        // Show alert for successful creation
        alert('Restaurant added successfully!');

        // Clear all textboxes
        setName('');
        setBorough('');
        setCuisine('');
        setBuilding('');
        setCoord([]);
        setStreet('');
        setZipcode('');
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Restaurant</h2>
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
      <div className="mb-3">
        <label className="form-label">Building:</label>
        <input type="text" className="form-control" value={building} onChange={(e) => setBuilding(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Coord (Latitude, Longitude):</label>
        <input
          type="text"
          className="form-control"
          value={coord.join(',')}
          onChange={(e) => setCoord(e.target.value.split(',').map(Number))}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Street:</label>
        <input type="text" className="form-control" value={street} onChange={(e) => setStreet(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Zipcode:</label>
        <input type="text" className="form-control" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={handleCreateRestaurant}>
        Create Restaurant
      </button>
      <br />
    </div>
  );
};

export default RestaurantForm;
