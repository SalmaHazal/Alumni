import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import hadi from "../Data/locat.json";
import "../index.css";
import Avatar from "../scenes/widgets/Avatar";
import { useNavigate } from "react-router-dom";

const UserLocations = () => {
  const [locations, setLocations] = useState([]);
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const addItem = (item) => {
    setList((prevList) => [...prevList, item]);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/locations");
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
      location: "",
    },
    onSubmit: async (values) => {
      for (const user of locations) {
        console.log("Processing user:", user);
        const match = hadi.find((tesla) => tesla.city === user.location);
        if (match) {
          console.log("Match found:", match);
          addItem({
            city: match.city,
            position: [match.lat, match.lng],
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            promotion: user.promotion,
            email: user.email,
            picturePath: user.picturePath || "default.png", // Use default image if picturePath is empty
          });
        } else {
          console.error(`No match found for ${user.location}`);
        }
      }
    },
  });
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    setIsVisible(false);
  };

  const truncateEmail = (email, length = 6) => {
    if (email.length <= length) return email;
    return email.substring(0, length) + "...";
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
      <form
        onSubmit={formik.handleSubmit}
        style={{ marginBottom: "8px", marginTop: "10px", marginLeft: "60px" }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleClick}
          style={{ display: isVisible ? "inline-block" : "none" }}
        >
          Laureate Location
        </Button>
      </form>

      <MapContainer
        center={[48.856614, 2.3522219]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "300px", width: "100%", borderRadius: "7px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
        {list.map((item, index) => (
          <Marker key={index} position={item.position}>
            <Popup
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="container">
                <Avatar
                  width={40}
                  height={40}
                  name={`${item?.firstName} ${item?.lastName}`}
                  imageUrl={item?.picturePath}
                  userId={item.id}
                />
                <div className="text-content">
                  <div>
                    <strong style={{ marginTop: "-4px", marginLeft: "-10px" }}>
                      {item.firstName} {item.lastName}
                    </strong>
                    <br />
                    <br />
                  </div>
                  <ul style={{ marginLeft: "-18px", cursor: "pointer" }}>
                    <li title={item.city}>City: {item.city}</li>
                    <li title={item.promotion}>Promo: {item.promotion}</li>
                    <li title={item.email}>
                      e-mail: {truncateEmail(item.email)}
                    </li>
                  </ul>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: "5px 10px", fontSize: "12px", marginLeft: "-30px" }}
                    onClick={() => navigate(`/chat/${item.id}`)}
                  >
                    Send A Message
                  </Button>
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
