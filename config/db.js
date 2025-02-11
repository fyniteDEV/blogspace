require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.PG_URI
});

pool.connect()
    .then(() => console.log("connected to database"))
    .catch((err) => {
        console.error("error connecting to database: " + err);
        process.exit(1);
    }
);

module.exports = pool;