import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const Changepassword = async (req, res) => {
    try {
        const { _id, actualPassword, newPassword } = req.body;

        // Fetch the user by ID
        const user = await User.findById(_id); 

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Verify the actual (old) password using bcrypt
        /*const isMatch = await bcrypt.compare(actualPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect current password." });
        }*/

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and save the document
        user.password = hashedPassword;  // Update the password field on the user document
        await user.save();  // Save the updated user document back to the database

        return res.status(200).json({ message: "Password changed successfully." });

    } catch (error) {
        console.error("Error in Changepassword function:", error);
        return res.status(500).json({ error: "An error occurred." });
    }
};
