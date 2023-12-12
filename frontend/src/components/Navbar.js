import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Map from './Map.js';


const AppNavbar = () => {
  const location = useLocation();
const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    if (location.pathname === '/login') {
      // If the user is already on the login page, no need to navigate
      return;
    }
   navigate('/login');
  };
const authToken = localStorage.getItem('token');
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          P&C
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Nav.Link>
            {!authToken && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register 
                </Nav.Link>
              </>
            )}
            {authToken && (
              <>
                <Nav.Link as={Link} to="/restaurants">
                  Restaurants
                </Nav.Link>
                <Nav.Link as={Link} to="/create">
                  Create Restaurant
                </Nav.Link>
                <Nav.Link as={Link} to="/update">
                  Update Restaurant
                </Nav.Link>
                <Nav.Link as={Link} to="/delete">
                  Delete Restaurant
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={logout}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {location.pathname === '/' && <Map />}
    </div>
  );
};

export default AppNavbar;
