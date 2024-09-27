const Lead = require('../model/leadSchema');

// Create a new lead (processing fields individually and modifying data)
exports.createLead = async (req, res) => {
    try {
        // Extract individual fields from req.body
        const { userId, userName } = req;

        const {
            channelType,
            adType,
            requiredViews,
            adLength,
            adState,
            adCity,
            createdBy,
            adDescription,
            adNote
        } = req.body;

        // Modify or add changes to the data (example changes)
        const modifiedAdDescription = adDescription ? adDescription.toUpperCase() : '';
        const modifiedAdNote = adNote ? `Note: ${adNote}` : '';
        const defaultRequiredViews = requiredViews < 100 ? 100 : requiredViews;  // Ensure required views is at least 100

        // Create the new lead object with modified data
        const newLead = new Lead({
            leadBy: userId,
            leadByName: userName,
            channelType,
            adType,
            requiredViews: defaultRequiredViews, // Set to 100 if less
            adLength: adLength > 5 ? adLength : 5, // Ensure adLength is at least 5
            adState,
            adCity,
            createdBy,
            createdDate: Date.now(), // Optionally modify the created date
            adDescription: modifiedAdDescription, // Set modified description
            adNote: modifiedAdNote  // Set modified note
        });

        if (createdBy == "iinsaf") {
            adLength = adLength * 500;
        };
        const adCost = requiredViews * adLength; // Calculate ad cost based on required views and ad length

        newLead.adCost = adCost; // Add calculated ad cost to the lead object

        // Save the new lead to the database
        const savedLead = await newLead.save();

        // Fetch all leads after saving
        const allLeads = await Lead.find({ leadBy: userId });

        // Respond with success message and all leads
        res.status(201).json({
            message: 'Lead created successfully',
            lead: savedLead,
            allLeads: allLeads  // Return all leads after creation
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating lead',
            error: error.message
        });
    }
};


// Update an existing lead
// exports.updateLead = async (req, res) => {
//     try {
//         const { userId, userName } = req;
//         // Extract individual fields from req.body
//         const {
//             channelType,
//             adType,
//             requiredViews,
//             adLength,
//             adState,
//             adCity,
//             createdBy,
//             adDescription,
//             adNote
//         } = req.body;


//         // Modify or add changes to the data (example changes)
//         const modifiedAdNote = adNote ? `Note: ${adNote}` : '';
//         const defaultRequiredViews = requiredViews < 100 ? 100 : requiredViews;

//         // Find the lead by ID and update it with modified data
//         const updatedLead = await Lead.findByIdAndUpdate(req.params.id, {
//             leadBy: userId,
//             leadByName: userName,
//             channelType,
//             adType,
//             requiredViews: defaultRequiredViews,
//             adLength: adLength > 5 ? adLength : 5,
//             adState,
//             adCity,
//             createdBy,
//             adDescription,
//             adNote: modifiedAdNote
//         }, { new: true });

//         if (!updatedLead) {
//             return res.status(404).json({
//                 message: 'Lead not found'
//             });
//         }

//         res.status(200).json({
//             message: 'Lead updated successfully',
//             updatedLead,
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: 'Error updating lead',
//             error: error.message
//         });
//     }
// };


// Delete an existing lead
exports.deleteLead = async (req, res) => {
    try {
        const { userId } = req;
        // Find the lead by ID and delete it
        const deletedLead = await Lead.findByIdAndDelete(req.params.id);

        if (!deletedLead) {
            return res.status(404).json({
                message: 'Lead not found'
            });
        }

        // Fetch all leads after deletion
        const allLeads = await Lead.find({ leadBy: userId });

        res.status(200).json({
            message: 'Lead deleted successfully',
            deletedLead,
            allLeads  // Return all leads after deletion
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error deleting lead',
            error: error.message
        });
    }
};


exports.getuserLeads = async (req, res) => {
    try {
        const { userId } = req;
        const { status } = req.query;

        // Create a query object with leadBy as a base condition
        let query = { leadBy: userId };

        // If status is provided, add it to the query
        if (status) {
            query.status = status;
        }

        // Find leads based on the query object
        const leads = await Lead.find(query);

        res.status(200).json(leads);
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching leads',
            error: error.message
        });
    }
};