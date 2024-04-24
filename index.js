const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// pegar rotas
const AuthRoutes = require('./routes/authRoutes.js');
const EventRoutes = require('./routes/eventRoutes.js');
const SubEventRoutes = require('./routes/subEventRoutes.js');

// inciar app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// usar rotas
app.use('/auth', AuthRoutes);
app.use('/event', EventRoutes);
app.use('/sub-event', SubEventRoutes);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});