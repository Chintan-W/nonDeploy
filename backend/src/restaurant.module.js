import mongoose from 'mongoose';
import Restaurant from './models/restaurant.model.js';
import path from 'path';

const initialize = async (connectionString) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Initialize the Restaurant model
    mongoose.model('Restaurant', Restaurant.schema);
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
    throw new Error('MongoDB initialization failed');
  }
};

const addNewRestaurant = async (data) => {
  try {
    const newRestaurant = await Restaurant.create(data);
    return newRestaurant;
  } catch (error) {
    console.error('Error adding new restaurant:', error);
    throw new Error('Error adding new restaurant');
  }
};

const getAllRestaurants = async (page, perPage, borough) => {
  try {
    const query = borough ? { borough } : {};
    const restaurants = await Restaurant
      .find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    return restaurants;
  } catch (error) {
    console.error('Error getting all restaurants:', error);
    throw new Error('Error getting all restaurants');
  }
};

const getRestaurantById = async (restaurantId) => {
  try {
    const restaurant = await Restaurant.findOne({ restaurant_id: restaurantId });
    return restaurant;
  } catch (error) {
    console.error('Error getting restaurant by ID:', error);
    throw new Error('Error getting restaurant by ID');
  }
};

const updateRestaurantById = async (data, restaurantId) => {
  try {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { restaurant_id: restaurantId },
      data,
      { new: true, runValidators: true }
    );

    return updatedRestaurant;
    }catch (error) {
    console.error('Error updating restaurant by ID:', error);
    throw new Error('Error updating restaurant by ID');
  }
};

const deleteRestaurantById = async (restaurantId) => {
  try {
    const deletedRestaurant = await Restaurant.findOneAndDelete({ restaurant_id: restaurantId });
    return deletedRestaurant;
  } catch (error) {
    console.error('Error deleting restaurant by ID:', error);
    throw new Error('Error deleting restaurant by ID');
  }
};

const getRestaurantsByBorough = async (borough) => {
  try {
    const restaurants = await Restaurant.find({ borough });
    return restaurants;
  } catch (error) {
    console.error('Error getting restaurants by borough:', error);
    throw new Error('Error getting restaurants by borough');
  }
};
const step3 = async (page, perPage, borough) => {
  try {
    const query = borough ? { borough } : {};
    const restaurants = await Restaurant
      .find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    return restaurants;
  } catch (error) {
    console.error('Error getting all restaurants:', error);
    throw new Error('Error getting all restaurants');
  }
};
export default {
  initialize,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
  getRestaurantsByBorough,
  step3,
};
