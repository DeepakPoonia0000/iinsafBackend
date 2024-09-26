const Otp = require("../model/OtpSchema");
const User = require("../model/UserRegisterSchema");
const UnverifiedUser = require('../model/unverifiedUserSchema');

const verifyOtp = async (req, res) => {
    try {
        const { userEmail, otp } = req.body;

        if (!userEmail || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required.' });
        }

        // Find the OTP for the userEmail
        const otpSchema = await Otp.findOne({ userEmail });
        if (!otpSchema) {
            return res.status(404).json({ error: 'OTP not found.' });
        }

        // Check if the OTP matches
        if (otpSchema.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP.' });
        }

        // Find the unverified user based on the userEmail
        const user = await UnverifiedUser.findOne({ userEmail });
        if (!user) {
            return res.status(404).json({ error: 'Unverified user not found.' });
        }

        // Create a new verified user object
        const verifiedUser = new User({
            userName: user.userName,
            userEmail: user.userEmail,
            userPassword: user.userPassword,
            phoneNumber: user.phoneNumber,
            userState: user.userState,
            userCity: user.userCity,
            joinAs: user.joinAs,
            gender: user.gender,
            isVerified: true
        });

        // Save the verified user to the User collection
        await verifiedUser.save();

        // Remove the unverified user and OTP from the database
        await Otp.deleteOne({ userEmail });
        await UnverifiedUser.deleteOne({ userEmail });

        // Send a success response
        res.status(200).json({ message: 'User successfully verified and registered!' });
    } catch (error) {
        console.error('Failed to verify OTP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { verifyOtp };
