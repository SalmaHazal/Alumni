import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useFormik } from 'formik';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import hadi from "../Data/locat.json";
import '../index.css';


const UserLocations = () => {
  const [locations, setLocations] = useState([]);
  const [list, setList] = useState([]);

  const addItem = (item) => {
    setList(prevList => [...prevList, item]);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/locations');
        console.log("Fetched locations:", response.data);
        setLocations(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocations();
  }, []);

  const formik = useFormik({
    initialValues: {
      location: '',
    },
    onSubmit: async (values) => {
      for (const user of locations) {
        console.log("Processing user:", user);
        const match = hadi.find(tesla => tesla.city === user.location);
        if (match) {
          console.log("Match found:", match);
          addItem({
            city: match.city,
            position: [match.lat, match.lng],
            firstName: user.firstName,
            promotion: user.promotion,
            email: user.email,
            picturePath: user.picturePath || 'default.png' // Use default image if picturePath is empty
          });
        } else {
          console.error(`No match found for ${user.location}`);
        }
      }
    }
  });
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    setIsVisible(false);
  };

  const truncateEmail = (email, length = 6) => {
    if (email.length <= length) return email;
    return email.substring(0, length) + '...';
  };

  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    useEffect(() => {
      map.locate();
    }, [map]);

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} style={{ marginBottom: '8px', marginTop: '10px', marginLeft: '60px' }}>
        <Button type="submit" variant="contained" color="primary" 
         onClick={handleClick}
         style={{ display: isVisible ? 'inline-block' : 'none' }}
        >
          Laureat Location
        </Button>
       
      </form>

      <MapContainer
        center={[48.856614, 2.3522219]}
        zoom={13}
        scrollWheelZoom
        style={{ height: '300px', width: '100%', borderRadius:"7px" }}
      >
        <TileLayer
          
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {list.map((item, index) => (
          <Marker key={index} position={item.position}>
            <Popup style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="container">
                <img src={`http://localhost:3001/assets/${item.picturePath}`}  className="image" />
                <div className="text-content">
                    <strong style={{marginTop: '-4px',marginleft: '-20px' }}>{item.firstName}</strong><br /><br />
                    <ul>
                        <li>City: {item.city}</li>
                        <li>Promo: {item.promotion}</li>
                        <li >e-mail: {truncateEmail(item.email)}</li>
                    </ul>
                    
                </div>
                
            </div>

            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

const Map = () => {
  return (
    <div className="App">
      <UserLocations />
    </div>
  );
};

export default Map;
