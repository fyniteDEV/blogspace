const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const path = require("path");

const app = express();

app.set("view engine", "ejs");

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const index = require("./routes/index")
app.use(index);


app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})