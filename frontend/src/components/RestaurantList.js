import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 12;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants?page=${currentPage}&perPage=${restaurantsPerPage}`);
        console.log('Response from backend:', response.data);
        const sortedRestaurants = response.data;
        setRestaurants(sortedRestaurants);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRestaurants();
  }, [currentPage, restaurantsPerPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage + 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const renderCards = () => {
    return restaurants.map((restaurant) => (
      <div key={restaurant._id} className="col-md-3 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">{restaurant.name}</h5>
            <p className="card-text">Restaurant ID: {restaurant.restaurant_id}</p>
            <p className="card-text">Address: {`${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`}</p>
            <p className="card-text">Borough: {restaurant.borough}</p>
          </div>
        </div>
      </div>
    ));
  };

  const pageButtons = (
    <>
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link" onClick={handlePreviousPage}>
          Previous
        </button>
      </li>
      {[currentPage - 1, currentPage, currentPage + 1].map((number) => (
        <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(Math.max(1, number))}>
            {Math.max(1, number)}
          </button>
        </li>
      ))}
      <li className="page-item">
        <button className="page-link" onClick={handleNextPage}>
          Next
        </button>
      </li>
    </>
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Restaurant List</h1>
      <div className="card-group">{renderCards()}</div>
      <nav className="mt-4">
        <ul className="pagination">
          {pageButtons}
        </ul>
      </nav>
    </div>
  );
};

export default RestaurantList;
