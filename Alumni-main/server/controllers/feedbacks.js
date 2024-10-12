import GoodFeedbacks from "../models/Feedbacks.js";
import WrongFeedbacks from "../models/Wrongfeedback.js";

export const AddFeedback = async (req, res) => {
  try {
    const { area, details, userId } = req.body;
    const file = req.file;
    const filePath = file ? file.path : null;

    const newFeedback = new GoodFeedbacks({
      improvementarea: area,
      userId,
      improvementdetails: details,
      file: filePath
    });

    await newFeedback.save();
    res.status(200).json({ message: 'Feedback added successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const AddWrongFeedback = async (req, res) => {
  try {
    const { area, details, userId } = req.body;
    const file = req.file;
    const filePath = file ? file.path : null;

    const newWrongFeedback = new WrongFeedbacks({
      wrongarea: area,  // Ensure this matches the model
      userId,
      wrongdetails: details,
      file: filePath
    });

    await newWrongFeedback.save();
    res.status(200).json({ message: 'Wrong feedback added successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
