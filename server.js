//requires express and path node modules
var express = require("express");
var path = require("path");

// Tells node that we are creating an "express" server
var app = express();

// creates the port to either use the provided port when deploying OR if not there, local port 8080
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//defines public directory for Heroku deployment
app.use(express.static(path.join(__dirname,"public")));

//links to routes folders
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// The below code  "starts" our server

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
