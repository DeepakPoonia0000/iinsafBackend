const ContactUs = require('../model/contactUsSchema')

const getMessagesFromUser = async (req, res) => {
    try {
        const message = await ContactUs.find()
        res.json(message)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const sendMessage = async (req, res) => {
    try {
        // Extract fields from the request body
        const { uName, uNumber, uEmail, uSubject, uMessage } = req.body;

        // Create a new ContactUs document
        const newContact = new ContactUs({
            uName,
            uNumber,
            uEmail,
            uSubject,
            uMessage
        });

        // Save the document to the database
        await newContact.save();

        // Respond with success message
        res.status(201).json({ message: 'Message sent successfully!', contact: newContact });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: 'Failed to send message.', error: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessagesFromUser
};