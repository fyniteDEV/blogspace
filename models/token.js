const pool = require("../config/db");

const blacklistToken = async (token) => {
    const query = `
        INSERT INTO blacklisted_tokens (token)
        VALUES ($1)
        RETURNING token;
    `
    const values = [ token ];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("An error occurred while executing the database query: " + err);
        throw err;
    }
}

module.exports = { blacklistToken };