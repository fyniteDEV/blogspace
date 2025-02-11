const pool = require("../config/db");

const getPostBySlug = async (slug) => {
    const query = `
        SELECT posts.id, title, slug, username AS author, body, created_at, updated_at FROM posts
        INNER JOIN users ON posts.author_id = users.id
        WHERE slug = $1;
    `;
    const values = [slug];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
        
    } catch (err) {
        console.error("An error occurred while executing the database query: " + err)
        throw err;
    }
}

// TODO: whatafak???
const getLatestPosts = async (limit = "9223372036854775807", offset = 0) => {
    const query = `
        SELECT title, slug, overview, created_at
        FROM posts
        ORDER BY created_at DESC
        OFFSET $1
        LIMIT $2;
    `
    const values = [offset, limit];

    try {
        const res = await pool.query(query, values);
        return res.rows;
        
    } catch (err) {
        console.error("An error occurred while executing the database query: " + err)
        throw err;
    }    
}

module.exports = {
    getPostBySlug,
    getLatestPosts
};