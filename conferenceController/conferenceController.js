const Conference = require('../model/conferenceSchema');

// Update a conference by ID
// const updateConference = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const {
//             conferenceName,
//             whatsappNumber,
//             conferenceEmailAddress,
//             numberOfReporters,
//             conferenceCost,
//             conferenceDate,
//             conferenceChannelState,
//             conferenceChannelCity,
//             conferenceArea,
//             conferencePinCode,
//             conferencePurpose
//         } = req.body;

//         // Update the conference
//         const updatedConference = await Conference.findByIdAndUpdate(
//             id,
//             {
//                 conferenceName,
//                 whatsappNumber,
//                 conferenceEmailAddress,
//                 numberOfReporters,
//                 conferenceCost,
//                 conferenceDate,
//                 conferenceChannelState,
//                 conferenceChannelCity,
//                 conferenceArea,
//                 conferencePinCode,
//                 conferencePurpose
//             },
//             { new: true, runValidators: true }  // `new: true` returns the updated document, `runValidators` enforces schema validation
//         );

//         if (!updatedConference) {
//             return res.status(404).json({ message: 'Conference not found' });
//         }

//         res.status(200).json({
//             message: 'Conference updated successfully',
//             conference: updatedConference
//         });

//     } catch (error) {
//         res.status(400).json({
//             message: 'Error updating conference',
//             error: error.message
//         });
//     }
// };

// Delete a conference by ID
const deleteConference = async (req, res) => {
    try {
        const { conferenceId } = req.query;
        const { userId } = req;

        const conference = await Conference.findById(conferenceId);

        if (!conference) {
            return res.status(404).json({ message: 'Conference not found' });
        }

        if (conference.conferenceBy != userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this conference' });
        }

        // Delete the conference
        const deletedConference = await Conference.findByIdAndDelete(conferenceId);

        res.status(200).json({
            message: 'Conference deleted successfully',
            conference: deletedConference
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error deleting conference',
            error: error.message
        });
    }
};


// Create a new conference
const createConference = async (req, res) => {
    try {
        const { userId, userName } = req;
        // Extract fields from the request body
        const {
            conferenceName,
            whatsappNumber,
            conferenceEmailAddress,
            numberOfReporters,
            conferenceDate,
            conferenceChannelState,
            conferenceChannelCity,
            conferenceArea,
            conferencePinCode,
            conferencePurpose
        } = req.body;

        const modifiedConferenceCost = numberOfReporters * 500;

        // Create a new conference object
        const newConference = new Conference({
            conferenceBy: userId,
            conferenceByName: userName,
            conferenceName,
            whatsappNumber,
            conferenceEmailAddress,
            numberOfReporters,
            conferenceCost: modifiedConferenceCost,
            conferenceDate,
            conferenceChannelState,
            conferenceChannelCity,
            conferenceArea,
            conferencePinCode,
            conferencePurpose
        });

        // Save the conference to the database
        const savedConference = await newConference.save();

        // Send the saved conference back in the response
        res.status(201).json({
            message: 'Conference created successfully',
            conference: savedConference
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error creating conference',
            error: error.message
        });
    }
};

const getuserConference = async (req, res) => {
    try {
        const { userId } = req;
        const { status } = req.query;

        // Create a query object with leadBy as a base condition
        let query = { conferenceBy: userId };

        // If status is provided, add it to the query
        if (status) {
            query.status = status;
        }

        // Find leads based on the query object
        const conference = await Conference.find(query);

        res.status(200).json(conference);
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching leads',
            error: error.message
        });
    }
};

module.exports = { createConference, deleteConference, getuserConference }
