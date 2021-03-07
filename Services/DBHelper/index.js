const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');

mongoose.connect(keys.MONGO_URI);
require('./models/Comment');
require('./models/Project');
require('./models/User');

const app = express();
app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge : 1000 * 60 * 60 * 24 * 30,
        keys : [keys.COOKIE_KEY]
    })
);

app.use(require('./routes/User').router);
app.use(require('./routes/Project').router);

app.listen(5555);