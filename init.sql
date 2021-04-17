CREATE TABLE keyboardsmash (
  id SERIAL PRIMARY KEY,
  contents VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE library (
  ks_id int PRIMARY KEY REFERENCES keyboardsmash,
  owner_id int NOT NULL REFERENCES users(id) 
);



INSERT INTO keyboardsmash (contents)
VALUES  ('sdlkfnlkf');

