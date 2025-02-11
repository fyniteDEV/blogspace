CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    salt VARCHAR(64) NOT NULL,
    hash VARCHAR(128) NOT NULL,
    is_author BOOLEAN DEFAULT FALSE
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    author_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    overview TEXT,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT posts_author_id_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comments_author_id_fk FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT comments_post_id_fk FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE blacklisted_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    blacklist_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);