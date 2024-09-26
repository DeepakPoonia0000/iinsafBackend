const Otp = require("../model/OtpSchema");
const User = require("../model/UserRegisterSchema");
const UnverifiedUser = require('../model/unverifiedUserSchema');
const nodemailer = require('nodemailer');


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


const resendOtp = async (req, res) => {
    try {
        const { userEmail } = req.body;

        // Check if userEmail is provided
        if (!userEmail) {
            return res.status(400).json({ message: "User email is required for sending OTP." });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP

        // Check if an OTP already exists for the userEmail
        let existingOtp = await Otp.findOne({ userEmail });

        if (existingOtp) {
            // Update the existing OTP
            existingOtp.otp = OTP;
            existingOtp.expireAt = new Date(); // Optionally update the expiration time
            await existingOtp.save();
        } else {
            // Create new OTP record
            const newOtp = new Otp({
                userEmail,  // Use userEmail, not email
                otp: OTP,
                expireAt: new Date() // Optionally add this if expireAt needs to be updated
            });
            await newOtp.save();
        }

        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "twoobgmi@gmail.com",
                pass: "tgxazopvyhfjplzz", // Consider moving this to environment variables
            },
        });

        const mailOptions = {
            from: "twoobgmi@gmail.com",
            to: userEmail,
            subject: "OTP Verification",
            text: `The 6-digit OTP for your Iinsaf account is ${OTP}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP has been sent to your email and is valid for 6 minutes." });

    } catch (error) {
        console.error('Error in sending OTP:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { userEmail } = req.body;

        // Check if userEmail is provided
        if (!userEmail) {
            return res.status(400).json({ message: "User email is required for sending OTP." });
        }

        const user = await User.findOne({ userEmail })

        if (!user) {
            res.status(500).json({ message: 'Invalid User or User not found .', error: error.message });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP

        // Check if an OTP already exists for the userEmail
        let existingOtp = await Otp.findOne({ userEmail });

        if (existingOtp) {
            // Update the existing OTP
            existingOtp.otp = OTP;
            existingOtp.expireAt = new Date(); // Optionally update the expiration time
            await existingOtp.save();
        } else {
            // Create new OTP record
            const newOtp = new Otp({
                userEmail,  // Use userEmail, not email
                otp: OTP,
                expireAt: new Date() // Optionally add this if expireAt needs to be updated
            });
            await newOtp.save();
        }

        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "twoobgmi@gmail.com",
                pass: "tgxazopvyhfjplzz", // Consider moving this to environment variables
            },
        });

        const mailOptions = {
            from: "twoobgmi@gmail.com",
            to: userEmail,
            subject: "OTP Verification",
            text: `The 6-digit OTP for your Iinsaf account is ${OTP}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP has been sent to your email and is valid for 6 minutes." });

    } catch (error) {
        res.status(500).json({ message: 'Server error ', error: error.message });
    }
}

const verifyOtpPassword = async (req, res) => {
    try {
        const { userEmail, otp, newPassword } = req.body;

        if (!newPassword || !otp) {
            return res.status(400).json({ error: 'Email,password and OTP are required.' });
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

        const user =await User.findOne({ userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.userPassword = newPassword;  // Assuming you're not hashing the password
        await user.save();

        // Optionally, delete the OTP entry after successful password reset
        await Otp.deleteOne({ userEmail });

        res.status(200).json({ message: 'Password reset successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error ', error: error.message });
    }
}

module.exports = { verifyOtp, resendOtp, resetPassword, verifyOtpPassword };
