import mongoose from "mongoose";

const contactusSchema = new mongoose.Schema({

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    }
  }, {
    timestamps: true,
  });
  

const ContactUs = mongoose.model("ContactUs", contactusSchema);
export default ContactUs;
