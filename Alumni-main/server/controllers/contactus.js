import ContactUs from "../models/conactus.js";

export const Addmessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const file = req.file;
    

    // Validate the request data
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFeedback = new ContactUs({
      name,
      email,
      message,
    });

    await newFeedback.save();
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error("Error in Addmessage:", error);  // Log the error to console
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
;
