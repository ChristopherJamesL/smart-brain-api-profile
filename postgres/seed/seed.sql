BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, pet, age, joined, imageUrl) VALUES ('Jessie', 'jessie@gmail.com', 0, 'dog', 15, '2018-01-01', null);
INSERT INTO login (hash, email) VALUES ('***YOUR HASHED PASSWORD HERE***', 'jessie@gmail.com');

COMMIT;