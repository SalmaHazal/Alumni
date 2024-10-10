import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostService = () => {
  const userId = useSelector((state) => state.user._id);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/services", {
        ...formData,
        provider: userId,
      });
      setMessage("Service posted successfully!");
      toast.success(message || "Service posted successfully!");
      setFormData({ title: "", description: "", price: "", provider: "" });
    } catch (error) {
      console.error("There was an error posting the service", error);
      setMessage("Failed to post the service");
      toast.error(message || "Failed to post the service");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Post a New Service</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Service Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Service Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Post Service
        </button>
      </form>
    </div>
  );
};

export default PostService;
