const express = require("express");
const libraryRouter = express.Router();
const { pool } = require("../config");

libraryRouter.get("/", (req, res) => {
  const owner_id = req.user.id;
  pool.query(
    `SELECT ks_id, contents 
      FROM library 
      JOIN keyboardsmash 
      ON library.ks_id = keyboardsmash.id 
      WHERE owner_id = $1
      ORDER BY ks_id`,
    [owner_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ data: results.rows });
    }
  );
});

libraryRouter.post("/", (req, res) => {
  const ks_id = parseInt(req.body.ks_id);
  if (req.user) {
    const owner_id = req.user.id;
    if (ks_id) {
      pool.query(
        "INSERT INTO library (ks_id, owner_id)  VALUES ($1, $2) RETURNING *;",
        [ks_id, owner_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          res.status(201).json({ data: results.rows });
        }
      );
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(401).json({ data: "not logged in" });
  }
});

libraryRouter.delete("/:ks_id", (req, res) => {
  const ks_id = parseInt(req.params.ks_id);
  if (ks_id) {
    pool.query("DELETE FROM library WHERE ks_id = $1;", [ks_id], (error) => {
      if (error) {
        throw error;
      }
      res.sendStatus(204);
    });
  } else {
    res.sendStatus(400);
  }
});

module.exports = libraryRouter;
