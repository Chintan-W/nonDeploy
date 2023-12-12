import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { restaurantId } = useParams();

  const handleSearch = async () => {
    console.log('Searching for restaurant:', searchTerm);

    // Fetch the restaurant data based on the search term
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurants/${searchTerm}`);
      const { coord } = response.data.address;

      if (map) {
        // Remove existing marker, if any
        if (marker) {
          marker.remove();
        }

        // Add a marker to the map
        const newMarker = new mapboxgl.Marker().setLngLat(coord).addTo(map);
        setMarker(newMarker);

        // Center the map on the marker
        map.flyTo({ center: coord, zoom: 15 });
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpbnRhbi13IiwiYSI6ImNscHZ1Z3ZheDA3bXkyaW54dGFiNDNhOGsifQ.ZWkuO3GwW39z6o_Gebv6hw';

    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-73.96805719999999, 40.7925587], // default center
        zoom: 14, // default zoom
      });

      setMap(newMap);

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove(); // Clean up map on component unmount
      }
    };
  }, [map]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`); 
        const { coord } = response.data.address;

        if (map) {
          // Add a marker to the map
          const newMarker = new mapboxgl.Marker().setLngLat(coord).addTo(map);
          setMarker(newMarker);

          // Center the map on the marker
          map.flyTo({ center: coord, zoom: 15 });
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    if (restaurantId && map) {
      fetchData();
    }
  }, [restaurantId, map]);

  return (
    <>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '1' }}>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={handleSearch}>
            Search
          </Button>
        </InputGroup>
      </div>
      <div id="map" style={{ width: '100%', height: 'calc(100vh - 60px)', position: 'absolute', top: '60px' }} />
    </>
  );
};

export default MapComponent;
