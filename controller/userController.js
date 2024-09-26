const User = require('../model/UserRegisterSchema');
const UnverifiedUser = require('../model/unverifiedUserSchema');
const Otp = require('../model/OtpSchema')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// Secret key for signing tokens
const JWT_SECRET = "qweRTYUI!@#$ERFC^X$Ex5DC68*()09780-0*(_"; // Use environment variables in production

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization'); // Assuming token is sent in headers
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, phoneNumber, userState, userCity, joinAs, gender } = req.body;

        // Check if all fields are present
        if (!userName || !userEmail || !userPassword || !phoneNumber || !userState || !userCity) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if userEmail or phoneNumber already exists
        const existingUser = await User.findOne({
            $or: [{ userEmail }, { phoneNumber }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or phone number already exists" });
        }

        // Generate OTP
        const OTP = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP

        // Check if an OTP already exists for the userEmail
        let existingOtp = await Otp.findOne({ userEmail });

        // console.log("user is here")
        if (existingOtp) {
            // Update the existing OTP
            existingOtp.otp = OTP;
            existingOtp.expireAt = new Date(); // Optionally update the expiration time
            await existingOtp.save();
        } else {
            // Create new OTP record
            const newOtp = new Otp({
                otp: OTP,
                email: userEmail
            });
            await newOtp.save();
        }

        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "twoobgmi@gmail.com",
                pass: "tgxazopvyhfjplzz",
            },
        });

        const mailOptions = {
            from: "twoobgmi@gmail.com",
            to: userEmail,
            subject: "OTP Verification",
            text: `Dear sir, The 6-digit OTP for your Iinsaf account is ${OTP}`,
        };

        await transporter.sendMail(mailOptions);

        // Create new user with the original password
        const newUser = new UnverifiedUser({
            userName,
            userEmail,
            userPassword,
            phoneNumber,
            userState,
            userCity,
            joinAs,
            gender
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User Will be registered successfully after otp verification. OTP sent to your email and is valid for 6 minutes." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Check if both fields are present
        if (!userEmail || !userPassword) {
            return res.status(400).json({ message: "Please provide both email and password" });
        }

        // Find the user by email
        const user = await User.findOne({ userEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords directly (since you're storing original password)
        if (user.userPassword !== userPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        // Save token in the user document
        user.token = token;
        await user.save();

        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, verifyToken };
