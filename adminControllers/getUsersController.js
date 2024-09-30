const User = require('../model/UserRegisterSchema');

const getSpecificUser = async (req, res) => {
    try {
        const { joinAs } = req.query;

        const users = await User.find({ joinAs: joinAs }).select("-userPassword");
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getSpecificUser
}