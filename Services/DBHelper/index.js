const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');

const app = express();
app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge : 1000 * 60 * 60 * 24 * 30,
        keys : [keys.COOKIE_KEY]
    })
);

mongoose.connect(keys.MONGO_URI);
require('./models/Comment');
require('./models/Project');
require('./models/User');

require('./routes/User')(app);
require('./routes/Project')(app);

app.listen(5000);