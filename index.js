const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const path = require("path");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const keyboardSmashRouter = require("./api/keyboardSmashRouter");
const libraryRouter = require("./api/libraryRouter");
const { resolveSoa } = require("dns");

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

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

app.get("/user", (req, res, next) => {
  if (req.user) {
    res.status(200).json({ data: { user: req.user } });
  } else {
    res.status(200).json({ data: {} });
  }
});

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
          "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
          [email, databasePassword],
          (error, results) => {
            if (error) {
              throw error;
            }
            const user = results.rows[0];
            const authToken = generateAuthToken();
            authTokens[authToken] = user;
            res.cookie("AuthToken", authToken);
            res.redirect("library");
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
