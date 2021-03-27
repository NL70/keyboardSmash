CREATE TABLE keyboardsmash (
  id SERIAL PRIMARY KEY,
  contents VARCHAR(255) NOT NULL
);

CREATE TABLE library (
  ks_id int PRIMARY KEY REFERENCES keyboardsmash
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

INSERT INTO keyboardsmash (contents)
VALUES  ('sdlkfnlkf');

