const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const _ = require('lodash');
const multer = require('multer');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// enable files upload
app.use(fileUpload({createParentPath: true}));

app.use(morgan('dev'));

app.use(express.static('uploads'));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "service health check is fine." });
});

require("./app/routes/quiz.route")(app);
require("./app/routes/advertise.route")(app);
require("./app/routes/user.route")(app);
require("./app/routes/promotion.route")(app);
require("./app/routes/user_activities.route")(app);
require("./app/routes/setting.route")(app);
require("./app/routes/fileUpload.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
