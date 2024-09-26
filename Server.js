const express = require('express');
const cors = require('cors');
const dbConnection = require('./dbConnection.js');
const cron = require('node-cron');
const { registerUser } = require('./controller/userController.js');
const { verifyOtp } = require('./controller/otpController.js');

const app = express();
const PORT = 7000;

dbConnection();

app.use(cors());
app.use(express.json());

app.post('/registerUser',
    registerUser
)

app.post('/verifyOtp',
    verifyOtp
)

app.listen(PORT, (error) => {
    if (!error) {
        console.log('Server is running successfully on port ' + PORT);
    } else {
        console.error('Error occurred, server cannot start: ' + error);
    }
});
