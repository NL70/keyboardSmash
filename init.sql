CREATE TABLE keyboardsmash (
  id SERIAL PRIMARY KEY,
  contents VARCHAR(255) NOT NULL
);

CREATE TABLE library (
  ks_id int PRIMARY KEY REFERENCES keyboardsmash
);

INSERT INTO keyboardsmash (contents)
VALUES  ('sdlkfnlkf');
