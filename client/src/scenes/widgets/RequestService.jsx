import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestService = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3001/services");
        console.log(response.data);
        setServices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching services", error);
        setServices([]);
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Services</h2>
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="border p-4 rounded shadow hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p>{service.description}</p>
              <p className="font-bold mt-2">Price: {service.price}</p>
              <p className="text-sm text-gray-500">
                Offered by:{" "}
                {`${service.provider.firstName} ${service.provider.lastName}`}
              </p>
              <button
                onClick={() => {
                  navigate(`/chat/${service.provider._id}`);
                }}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Request Service
              </button>
              <button
                onClick={() => {
                  navigate(`/profile/${service.provider._id}`);
                }}
                className="ml-2 mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Provider's Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No services available at the moment.</p>
      )}
    </div>
  );
};

export default RequestService;
