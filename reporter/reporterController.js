const Lead = require("../model/leadSchema");

const acceptLead = async (req, res) => {
    try {
        const { leadId, acceptedViews } = req.body;
        const { userId, userName, joinAs } = req;

        if (joinAs != 'reporter') {
            return res.status(403).json({ message: 'User is not authorized to perform this function' });
        }

        // Ensure acceptedViews is valid
        if (!acceptedViews || acceptedViews < 100) {
            return res.status(400).json({ message: 'Invalid accepted views. It must be at least 100.' });
        }

        // Find the lead by ID
        const currentLead = await Lead.findById(leadId);

        // Check if the lead exists
        if (!currentLead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Calculate the total accepted views already present and the current remaining views
        const totalAcceptedViews = currentLead.acceptedViews.reduce((total, view) => total + view.acceptedAmount, 0);

        const remainingViews = currentLead.requiredViews - totalAcceptedViews;

        // Check if acceptedViews is greater than remaining views
        if (acceptedViews > remainingViews) {
            return res.status(400).json({ message: `Accepted views exceed remaining views. You can only accept up to ${remainingViews} views.` });
        }

        // Add the accepted views to the acceptedViews array
        currentLead.acceptedViews.push({
            acceptedBy: userId,
            acceptedByName: userName,
            acceptedAmount: acceptedViews
        });

        // Update remainingViews
        currentLead.remainingViews = Math.max(currentLead.requiredViews - (totalAcceptedViews + acceptedViews), 0);

        // Save the updated lead document
        await currentLead.save();

        // Return a successful response
        res.status(200).json({
            message: 'Views accepted and lead updated successfully',
            remainingViews: currentLead.remainingViews,
            lead: currentLead
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { acceptLead }