const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const path = require("path");
const cookieParser = require("cookie-parser");
const keyboardSmashRouter = express.Router();
const libraryRouter = express.Router();
const crypto = require("crypto");

const authTokens = {};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  const livereload = require("livereload");
  const connectLivereload = require("connect-livereload");

  // Reload browser when saving frontend code
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(__dirname + "/public");

  // Reload the page when the server has started
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLivereload());
}

app.use((req, res, next) => {
  const authToken = req.cookies["AuthToken"];
  req.user = authTokens[authToken];
  next();
});

// Get all

keyboardSmashRouter.get("/", (req, res) => {
  pool.query(
    `SELECT id, contents, (CASE WHEN ks_id IS NULL THEN FALSE ELSE TRUE END) 
    AS is_saved 
    FROM keyboardsmash 
    LEFT JOIN library 
    ON keyboardsmash.id = library.ks_id
    ORDER BY id;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ data: results.rows });
    }
  );
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

libraryRouter.get("/", (req, res) => {
  pool.query(
    `SELECT ks_id, contents 
    FROM library 
    JOIN keyboardsmash 
    ON library.ks_id = keyboardsmash.id 
    ORDER BY ks_id`,
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
  if (ks_id) {
    pool.query(
      "INSERT INTO library (ks_id)  VALUES ($1) RETURNING *;",
      [ks_id],
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

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

app.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  const databasePassword = getHashedPassword(password);
  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      const user = results.rows[0];
      if (user) {
        if (user.password === databasePassword) {
          const authToken = generateAuthToken();
          authTokens[authToken] = user;
          res.cookie("AuthToken", authToken);
          res.redirect("library");
        } else {
          res.status(400).json({ data: "Incorrect password" });
        }
      } else {
        pool.query(
          "INSERT INTO users (email, password) VALUES ($1, $2)",
          [email, databasePassword],
          (error) => {
            if (error) {
              throw error;
            }
            res.status(200).json({ data: "Signup success" });
          }
        );
      }
    }
  );
});

// Static files
app.use(express.static("public"));

app.use("/keyboardsmash", keyboardSmashRouter);
app.use("/keyboardsmashlibrary", libraryRouter);

const publicPath = path.join(__dirname, "public");

app.use("/library", (req, res) => {
  if (req.user) {
    res.sendFile(publicPath + "/library.html");
  } else {
    res.sendFile(publicPath + "/login.html");
  }
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`);
});
