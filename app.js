require('dotenv').config();

const Server = require('./models/server');
new Server().listen();