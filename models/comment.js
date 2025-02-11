const pool = require("../config/db");

const postNewComment = async (content, userId, postId) => {
    const query = `
        INSERT INTO comments (author_id, post_id, content)
        VALUES ($1, $2, $3);
    `
    const values = [userId, postId, content];

    try {
        const res = await pool.query(query, values);
        return res.rows;
        
    } catch (err) {
        console.error("An error occurred while executing the database query: " + err)
        throw err;
    }    
}

const getComments = async (postId) => {
    const query = `
        SELECT users.username, content, created_at FROM comments
        INNER JOIN users ON comments.author_id = users.id
        WHERE post_id = $1
        ORDER BY created_at DESC;
    `
    values = [postId]

    try {
        const res = await pool.query(query, values);
        return res.rows;
        
    } catch (err) {
        console.error("An error occurred while executing the database query: " + err)
        throw err;
    }   
}

module.exports = {
    postNewComment,
    getComments
}