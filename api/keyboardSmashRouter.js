const express = require("express");
const keyboardSmashRouter = express.Router();
const { pool } = require("../config");

// Get all

keyboardSmashRouter.get("/", (req, res) => {
  if (req.user) {
    const owner_id = req.user.id;
    pool.query(
      `SELECT id, contents, (CASE WHEN owner_id = $1 THEN TRUE ELSE FALSE END)
          AS is_saved 
          FROM keyboardsmash 
          LEFT JOIN library 
          ON keyboardsmash.id = library.ks_id
          ORDER BY id;`,
      [owner_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json({ data: results.rows });
      }
    );
  } else {
    pool.query(
      `SELECT id, contents, false AS is_saved 
            FROM keyboardsmash 
            ORDER BY id;`,
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json({ data: results.rows });
      }
    );
  }
});

// Add new keyboardsmash

keyboardSmashRouter.post("/", (req, res) => {
  const { contents } = req.body;
  if (contents) {
    pool.query(
      "INSERT INTO keyboardsmash (contents) VALUES ($1) RETURNING *;",

      [contents],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).json({ data: results.rows[0] });
      }
    );
  } else {
    res.status(400);
  }
});

keyboardSmashRouter.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { contents } = req.body;
  if (contents) {
    pool.query(
      "UPDATE keyboardsmash SET contents = $1 WHERE id = $2;",
      [contents, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json({ data: results.rows[0] });
      }
    );
  } else {
    res.status(400);
  }
});

keyboardSmashRouter.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("DELETE FROM keyboardsmash WHERE id = $1", [id], (error) => {
    if (error) {
      throw error;
    }
    res.status(204).send();
  });
});

module.exports = keyboardSmashRouter;
