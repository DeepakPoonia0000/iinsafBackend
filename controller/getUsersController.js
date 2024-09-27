const User = require('../model/UserRegisterSchema');

// const getAdvertisers = async (req, res) => {
//     try {
//         const advertisers = await User.find({ joinAs: "advertiser" }).select("-userPassword");
//         res.status(200).json({ advertisers });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// const getInfluencers = async (req, res) => {
//     try {
//         const influencer = await User.find({ joinAs: "influencer" }).select("-userPassword");
//         res.status(200).json({ influencer });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

// const getReporters = async (req, res) => {
//     try {
//         const reporters = await User.find({ joinAs: "reporter" }).select("-userPassword");
//         res.status(200).json({ reporters });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }

const getSpecificUser = async (req, res) => {
    try {
        const { joinAs } = req.query;
        const users = await User.find({ joinAs: joinAs }).select("-userPassword");
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = { getAdvertisers, getInfluencers, getReporters, getSpecificUser }