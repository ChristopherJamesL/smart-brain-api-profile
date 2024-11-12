BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, pet, age, joined, imageUrl) VALUES ('Jessie', 'jessie@gmail.com', 0, 'dog', 15, '2018-01-01', null);
INSERT INTO login (hash, email) VALUES ('$2a$10$yhpD1e2C8HMxk6DusK7.henQH1ZYYC1sRBRBwegCFrxZtlqmMXzJi', 'jessie@gmail.com');

COMMIT;