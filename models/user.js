const pool = require("../config/db");

const createUser = async (email, username, salt, hash) => {
    const query = `
        INSERT INTO users (email, username, salt, hash)
        VALUES ($1, $2, $3, $4)
        RETURNING uuid, email, username;
    `;
    const values = [email, username, salt, hash];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("An error occurred while executing the database query: " + err);
        throw err;
    }
}

const getUserByEmail = async (email) => {
    const query = `
        SELECT * FROM users
        WHERE email = $1;
    `;
    const values = [email];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
        
    } catch (err) {
        console.error("An error occurred while executing the database query: " + err)
        throw err;
    }
}

const getUserByEmailOrUsername = async (email, username) => {
    const query = `
        SELECT * FROM users
        WHERE email = $1 OR username = $2;
    `
    const values = [email, username];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
            
    } catch (err) {
        console.error("An error occurred while executing the database query: " +  err);
        throw err;   
    }
}

const getUserByUUID = async (uuid) => {
    const query = `
        SELECT * FROM users
        WHERE uuid = $1;
    `
    const values = [uuid];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error("An error occurred while executing the database query: " +  err);
        throw err; // Pass the error on to Passport       
    }
} 

module.exports = {
    createUser,
    getUserByEmail,
    getUserByEmailOrUsername,
    getUserByUUID
}