const express = require('express');
const cors = require('cors');
const dbConnection = require('./dbConnection.js');
const cron = require('node-cron');
const { registerUser, verifyToken, loginUser, updateUserDetails, userProfile } = require('./controller/userController.js');
const { verifyOtp, resendOtp, resetPassword, verifyOtpPassword } = require('./controller/otpController.js');
const { createLead, deleteLead, getuserLeads } = require('./userControllers/getUserLeadsController.js');
const { getSpecificUser } = require('./adminControllers/getUsersController.js');
const { createConference, deleteConference, getuserConference } = require('./conferenceController/conferenceController.js');
const { getMessagesFromUser, sendMessage } = require('./contactUsSchema&controller/contactUsController.js');

const app = express();
const PORT = 7000;

dbConnection();

app.use(cors());
app.use(express.json());

app.post('/registerUser', registerUser);
app.post('/loginUser', loginUser);
app.get('/userProfile', verifyToken, userProfile);
app.put('/updateUserDetails', verifyToken, updateUserDetails)


app.post('/sendMessage',
    verifyToken,
    sendMessage
)


app.post('/verifyOtp', verifyOtp)
app.post('/resendOtp', resendOtp)
app.post('/resetPassword', resetPassword)
app.post('/verifyOP', verifyOtpPassword)


app.post('/createLead', verifyToken, createLead)
app.delete('/deleteLead', verifyToken, deleteLead)
app.get('/getUserLeads', verifyToken, getuserLeads)


app.post('/createConference', verifyToken, createConference)
app.delete('/deleteConference', verifyToken, deleteConference)
app.get('/getUserConference', verifyToken, getuserConference)




app.get('/getSpecificUser',
    // adminVerifyToken,
    getSpecificUser
)

app.get('/getMessagesFromUser',
    // adminVerifyToken,
    getMessagesFromUser
)

app.listen(PORT, (error) => {
    if (!error) {
        console.log('Server is running successfully on port ' + PORT);
    } else {
        console.error('Error occurred, server cannot start: ' + error);
    }
});
