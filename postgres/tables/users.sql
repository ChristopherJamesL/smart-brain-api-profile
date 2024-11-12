BEGIN TRANSACTION;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email TEXT UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    pet VARCHAR(100),
    age INT CHECK (age <= 200),
    joined TIMESTAMP NOT NULL,
    imageurl TEXT
);

COMMIT;