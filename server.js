const express = require('express');
const db = require('./db/database');

const PORT = process.env.PORT || parseInt(process.env.port);
const app = express();

const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// ----------Don't add any code below------------- //
// default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
})

// Start server after DB connection
db.on('ready', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});