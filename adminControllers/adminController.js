const Lead = require('../model/leadSchema')
const Conference = require('../model/conferenceSchema');
const User = require('../model/UserRegisterSchema');

const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        res.status(200).json(leads)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllConference = async (req, res) => {
    try {
        const conference = await Conference.find();
        res.status(200).json(conference)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getSpecificUsersLeads = async (req, res) => {
    try {
        const { userId } = req.query;
        const leads = await Lead.find({ leadBy: userId });
        res.status(200).json(leads)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getSpecificUsersConferences = async (req, res) => {
    try {
        const { userId } = req.query;
        const conference = await Conference.find({ conferenceBy: userId });
        res.status(200).json(conference)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getStatusCounts = async (req, res) => {
    try {
        // Get today's start and end dates
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);  // Set to 00:00:00 of the current day
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);  // Set to 23:59:59 of the current day

        const [totalLeadCount, pendingLeadCount, rejectedLeadCount, acceptedLeadCount, completedLeadCount, createdTodayLeadCount] = await Promise.all([
            Lead.countDocuments(), // Count all documents
            Lead.countDocuments({ status: 'pending' }),
            Lead.countDocuments({ status: 'cancelled' }),
            Lead.countDocuments({ status: 'approved' }),
            Lead.countDocuments({ status: 'completed' }),
            Lead.countDocuments({
                createdDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })  // Count documents created today
        ]);

        const totalAdvertisers = await User.countDocuments({ joinAs: 'advertiser' });
        const totalInfluencers = await User.countDocuments({ joinAs: 'influencer' });
        const totalReporters = await User.countDocuments({ joinAs: 'reporter' });


        const [totalConferenceCount, pendingConferenceCount, rejectedConferenceCount, acceptedConferenceCount, completedConferenceCount, createdTodayConferenceCount] = await Promise.all([
            Conference.countDocuments(), // Count all documents
            Conference.countDocuments({ status: 'pending' }),
            Conference.countDocuments({ status: 'cancelled' }),
            Conference.countDocuments({ status: 'approved' }),
            Conference.countDocuments({ status: 'completed' }),
            Conference.countDocuments({
                createdDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            })  // Count documents created today
        ]);

        res.json({
            leads: {
                total: totalLeadCount,
                pending: pendingLeadCount,
                rejected: rejectedLeadCount,
                accepted: acceptedLeadCount,
                completed: completedLeadCount,
                createdToday: createdTodayLeadCount
            },
            conferences: {
                total: totalConferenceCount,
                pending: pendingConferenceCount,
                rejected: rejectedConferenceCount,
                accepted: acceptedConferenceCount,
                completed: completedConferenceCount,
                createdToday: createdTodayConferenceCount
            },
            totalAdvertisers,
            totalInfluencers,
            totalReporters,
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching status counts", error });
    }
};
