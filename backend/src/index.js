import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import restaurantModule from './restaurant.module.js';
import User from './user.module.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT ;

const __filename =fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));



// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI; 

const initializeMongoDB = async () => {
  try {
    // Initialize MongoDB and the Restaurant model
    await restaurantModule.initialize(MONGODB_URI);
    console.log('MongoDB initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
    process.exit(1);
  }
};

// JWT Secret Key
const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


// User registration route
app.post('/api/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // Use an appropriate saltRounds value

    // Create a new user with the hashed password
    const newUser = await User.createUser({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// login route
app.post('/api/login', (req, res, next) => {
  const { username, password } = req.body;
  console.log('Entered login route:', username, password);

  // Verify user credentials
  let foundUser; // Declare a variable to store the user

  User.getUserByUsername(username)
    .then((user) => {
      foundUser = user; // Store the user in the variable
      console.log('User found:', foundUser);

      if (!foundUser) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare the entered password with the hashed password in the database
      return bcrypt.compare(password, foundUser.password);
    })
    .then((isPasswordMatch) => {
      console.log('Entered password:', password);
      console.log('Hashed password from database:', foundUser.password);
      console.log('Is password match?', isPasswordMatch);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: foundUser._id }, jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    })
    .catch((error) => {
      console.error('Login error:', error);
      next(error);
    });
});


app.post('/api/restaurants', async (req, res) => {
  try {
    const newRestaurant = await restaurantModule.addNewRestaurant(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    next(error);
  }
});

app.put('/api/restaurants/:restaurant_id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    const updatedRestaurant = await restaurantModule.updateRestaurantById(req.body, restaurantId);
    res.json(updatedRestaurant);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/restaurants/:restaurant_id',  async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    const deletedRestaurant = await restaurantModule.deleteRestaurantById(restaurantId);
    if (deletedRestaurant) {
      res.json({ message: 'Restaurant deleted successfully' });
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    next(error);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const { page = 1, perPage = 10, borough } = req.query;
    const restaurants = await restaurantModule.getAllRestaurants(page, perPage, borough);
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
});

app.get('/api/restaurants/:restaurant_id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    const restaurant = await restaurantModule.getRestaurantById(restaurantId);
    if (restaurant) {
      res.json(restaurant);
    } else { 
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (error) {
    next(error);
  }
});



//eeeeeeeeeeejjjjjjjjjjjjjjsssssssssssssssss
// Render the form
app.get('/api/restaurants-details', (req, res) => {
  res.render('restaurants-details-form');
});

// Handle form submission
app.post('/api/restaurants-details', async (req, res, next) => {
  try {
    // Extract parameters from both query and body
    const { page: queryPage, perPage: queryPerPage, borough: queryBorough } = req.query;
    const { page: bodyPage, perPage: bodyPerPage, borough: bodyBorough } = req.body;

    // Use the values from the body if available, otherwise use the values from the query
    const page = bodyPage || queryPage || 1;
    const perPage = bodyPerPage || queryPerPage || 10;
    const borough = bodyBorough || queryBorough;

    console.log('page: ', page, 'perPage: ', perPage, 'borough: ', borough);

    const restaurants = await restaurantModule.getAllRestaurants(page, perPage, borough);

    // Render the results in a different view, passing the 'page' variable
    res.render('restaurants-results-details', { restaurants, page, perPage, borough});
  } catch (error) {
    next(error);
  }
});


const startServer = async () => {
  await initializeMongoDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
