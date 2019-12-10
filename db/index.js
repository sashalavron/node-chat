const mongoose = require("mongoose");

//Configure Mongoose
mongoose.connect("mongodb://localhost/node-chat");
mongoose.set("debug", true);
